const fs = require('fs');
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'minha-chave-super-secreta';

// No meio das configurações
app.use(express.static(path.join(__dirname, 'public')));

// --- MIDDLEWARES DE CONFIGURAÇÃO ---
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- CONFIGURAÇÃO DO BANCO DE DADOS (SQLITE) ---
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './biblioteca.db'
});

// --- MODELOS ---
const Livro = sequelize.define('Livro', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    autor: { type: DataTypes.STRING },
    categoria: { type: DataTypes.STRING },
    ano: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING, defaultValue: 'disponivel' },
    imagemUrl: { type: DataTypes.STRING, defaultValue: '/imagens/capa-padrao.jpg' }
});

const Usuario = sequelize.define('Usuario', {
    nome: { type: DataTypes.STRING, allowNull: false },
    senha: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'cliente' }
});

const Locacao = sequelize.define('Locacao', {
    dataEmprestimo: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    dataDevolucao: { type: DataTypes.DATEONLY },
});

// RELACIONAMENTOS
Locacao.belongsTo(Usuario);
Locacao.belongsTo(Livro);



// --- HELPERS ---
const calcularPrazo = (dias) => {
    const data = new Date();
    data.setDate(data.getDate() + parseInt(dias || 7));
    return data.toISOString().split('T')[0];
};

// --- MIDDLEWARES DE SEGURANÇA ---
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send("Token não fornecido.");
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).send("Token inválido.");
        req.user = decoded;
        next();
    });
};

const verificarAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send("Acesso negado.");
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err || decoded.role !== 'admin') return res.status(403).send("Acesso restrito.");
        req.user = decoded;
        next();
    });
};

// --- ROTAS DE AUTENTICAÇÃO ---

// --- ROTAS DE VISUALIZAÇÃO (PÁGINAS) ---

// Página de Login (Raiz)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Página do Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Página do Catálogo de Livros
app.get('/catalogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'catalogo.html'));
});

// Página de Gerenciamento de Usuários
app.get('/usuarios-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'usuarios.html'));
});

// Página de Locações
app.get('/locacoes-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'locacoes.html'));
});

app.get('/gerenciar-livro',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'gerenciar-livro.html'));
});

app.post('/login', async (req, res) => {
    const { nome, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { nome, senha } });

    if (usuario) {
        const token = jwt.sign(
            { id: usuario.id, role: usuario.role, nome: usuario.nome },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.json({ auth: true, token, role: usuario.role });
    } else {
        res.status(401).send("Usuário ou senha inválidos.");
    }
});



// --- ROTAS DE LIVROS ---

app.get('/livros', async (req, res) => {
    const livros = await Livro.findAll();
    res.json(livros);
});

app.get('/livros/buscar', async (req, res) => {
    const { termo, categoria } = req.query;
    let onde = {};

    if (termo) {
        onde[Op.or] = [
            { titulo: { [Op.like]: `%${termo}%` } },
            { autor: { [Op.like]: `%${termo}%` } }
        ];
    }
    if (categoria) {
        onde.categoria = categoria;
    }

    const resultado = await Livro.findAll({ where: onde });
    res.json(resultado);
});

app.post('/livros', verificarAdmin, async (req, res) => {
    try {
        const novo = await Livro.create(req.body);
        res.status(201).json(novo);
    } catch (e) { res.status(400).send("Erro ao salvar."); }
});

app.delete('/livros/:id', verificarAdmin, async (req, res) => {
    const deletado = await Livro.destroy({ where: { id: req.params.id } });
    if (deletado) res.send("Livro removido.");
    else res.status(404).send("Livro não encontrado.");
});

// --- ROTAS DE USUÁRIOS ---

app.get('/usuarios', verificarAdmin, async (req, res) => {
    const lista = await Usuario.findAll({ attributes: ['id', 'nome', 'role'] });
    res.json(lista);
});

app.post('/usuarios', verificarAdmin, async (req, res) => {
    try {
        const novo = await Usuario.create(req.body);
        res.status(201).json(novo);
    } catch (e) { res.status(400).send("Erro ao criar."); }
});

app.delete('/usuarios/:id', verificarAdmin, async (req, res) => {
    await Usuario.destroy({ where: { id: req.params.id } });
    res.send("Usuário deletado.");
});

// --- ROTAS DE LOCAÇÃO ---

app.post('/locacoes', verificarToken, async (req, res) => {
    const { livroId, dias } = req.body;
    const livro = await Livro.findByPk(livroId);

    if (!livro || livro.status === 'indisponivel') {
        return res.status(400).send("Livro indisponível.");
    }

    const novaLocacao = await Locacao.create({
        UsuarioId: req.user.id, // O Sequelize cria FK com esse nome (Model + Id)
        LivroId: livro.id,
        dataDevolucao: calcularPrazo(dias)
    });

    await livro.update({ status: 'indisponivel' });
    res.status(201).json(novaLocacao);
});

app.get('/admin/dashboard', verificarAdmin, async (req, res) => {
   try {
        const totalLivros = await Livro.count();
        const totalUsuarios = await Usuario.count();
        const totalLocacoes = await Locacao.count();
        
        // Busca as locações incluindo os dados das tabelas relacionadas (JOIN)
        const locacoesAtivas = await Locacao.findAll({
            include: [
                { model: Usuario, attributes: ['nome'] },
                { model: Livro, attributes: ['titulo'] }
            ]
        });

        // Formata a lista de empréstimos para o front-end
        const relatorio = locacoesAtivas.map(loc => ({
            id: loc.id,
            usuario: loc.Usuario ? loc.Usuario.nome : "Usuário Excluído",
            livro: loc.Livro ? loc.Livro.titulo : "Livro Excluído",
            prazo: loc.dataDevolucao
        }));

        // RETORNO COMPLETO: Agora o front-end verá os totais e a lista
        res.json({ 
            totalLivros, 
            totalUsuarios, 
            totalLocacoes, 
            emprestimosAtivos: relatorio 
        });

    } catch (error) {
        console.error("Erro no dashboard:", error);
        res.status(500).json({ erro: "Erro ao carregar dados do painel." });
    }
});

app.delete('/locacoes/:id', verificarToken, async (req, res) => {
    const loc = await Locacao.findByPk(req.params.id);
    if (!loc) return res.status(404).send("Locação não encontrada.");

    const livro = await Livro.findByPk(loc.LivroId);
    if (livro) await livro.update({ status: 'disponivel' });

    await loc.destroy();
    res.send("Livro devolvido.");
});

// --- INICIALIZAÇÃO DO BANCO E DO SERVIDOR ---

sequelize.sync({ force: false }).then(async () => {
    console.log("✅ Tabelas recriadas com sucesso.");

    // Cria o Admin 
    await Usuario.create({
        nome: "admin bib",
        senha: "admin2026",
        role: "admin"
    });

    // Cria um Usuário comum para testes
    await Usuario.create({
        nome: "usuario1",
        senha: "123456",
        role: "cliente"
    });

    await Livro.bulkCreate([
        {
            titulo: "Dom Casmurro", 
            autor: "Machado de Assis", 
            categoria: "Literatura", 
            ano: 1899,
            imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmVJMKLM3iLIE67043oK-nWltTO5UIq7EU5g&s"
        },
        {
            titulo: "O Alquimista", 
            autor: "Paulo Coelho", 
            categoria: "Ficção", 
            ano: 1988,
            imagemUrl: "https://bibliotecamundial.com.br/wp-content/uploads/2025/01/o-alquimista-paulo-coelho.webp"
        }
    ]);

    console.log("✅ Dados iniciais inseridos!");
    
    app.listen(3000, () => {
        console.log("🚀 SERVIDOR VIVO EM: http://localhost:3000");
    });

}).catch(err => {
    console.error("❌ Erro fatal ao sincronizar:", err);
});
