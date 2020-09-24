const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");

module.exports = (req, res, next) => {
    if (!req.payload.id) return res.sendStatus(401);
    const { loja } = req.query;
    if (!loja) return res.status(401).json({ errors: "Nenhuma loja encontrada para esse usuário" });
    Usuario.findById(req.payload.id).then(usuario => {
        if (!usuario) return res.sendStatus(401);
        if (!usuario.loja) return res.sendStatus(401);
        if (!usuario.permissao.includes("admin")) return res.status(401).json({ errors: "Usuário sem permissão de admin" });
        if (usuario.loja.toString() !== loja) return res.status(401).json({ errors: "Essa loja não pertence a esse usuário" });
        next();
    }).catch(next);
}