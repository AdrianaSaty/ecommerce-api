const mongoose = require("mongoose");
const User = mongoose.model("User");
const enviarEmailRecovery = require("../helpers/email-recovery");

class UserController {
    // GET /
    indexedDB(req, res, next) {
        User.findById(req.payload.id).then(user => {
            if(!user) return res.status(401).json({ errors: "User not registered"});
            return res.json({ user: user.enviarAuthJSON() });
        }).catch(next)
    }

    // GET /:id
    show(req, res, next) {
        User.findById(req.params.id).populate({ path: "loja" })
        .then(user => {
            if(!user) return res.status(401).json({ errors: "User not registered"});
            return res.json({
                user: {
                    nome: user.nome,
                    email: user.email,
                    permissao: user.permissao,
                    loja: user.loja
                }
            });
        }).catch(next)
    }

    // POST /registrar
    store(req, res, next) {
        const {nome, email, password} = req.body;
        if( !nome || !email || !password ) return res.status(422).json({ errors: "Preencha todos os campos"});

        const user = new User({ nome, email });
        user.setSenha(password);

        user.save()
        .then(() => res.json({ user: user.enviarAuthJSON() }))
        .catch(next);
    }

    // PUT /
    update(req, res, next) {
        const { nome, email, password } = req.body;
        User.findById(req.payload.id).then((user) => {
            if(!user) return res.status(401).json({ errors: "User not registered"});
            if(typeof nome != "undefined") user.nome = nome;
            if(typeof email != "undefined") user.email = email;
            if(typeof password != "undefined") user.nome = nome;
            if(typeof nome != "undefined") user.setSenha(password);

            return usuario.save().then(() => {
                return res.json({ user: user.enviarAuthJSON() })
            })
        }).catch(next);
    }

    // DELETE /
    remove(req, res, next) { 
        User.findById(req.payload.id).then((user) => {
            if(!user) return res.status(401).json({ errors: "User not registered"});
            return user.remove().then(() => {
                return res.json({ deletado: true })
            }).catch(next);
        })
    }

    // POST /login
    login(req, res, next) { 
        const { email, password } = req.body;
        if(!email) return res.status(422).json({ errors: "Field cannot be empty"});
        if(!password) return res.status(422).json({ errors: "Field cannot be empty"});
        User.findOne({ email }).then((user) => {
            if(!user) return res.status(401).json({ errors: "User not registered"});
            if(!user.validarSenha(password)) return res.status(401).json({ errors: "Invalid Password"});
            return res.json({ user: user.enviarAuthJSON() });
        }).catch(next);
    }

    // ---- RECOVERY ----

    // GET /recover-password
    showRecovery(req, res, next) {
        return res.render('recovery', {error: null, success: null });
    }

    // POST /recover-password
    createRecovery(req, res, next) {
        const { email } = req.body;
        if(!email) return res.render('recovery', {error: "Fill with your email", success: null });

        User.findOne({ email }).then((user) => {
            if(!user) return res.render("recovery", { error: "There is no user with this email", success: null });
            const recoveryData = user.criarTokenRecuperacaoSenha();
            return user.save().then(() => {
                return res.render("recovery", {error: null, success: true });
            }).catch(next);
        })
    }

    // GET /recovered-password
    showCompleteRecovery(req, res, next) {
        if(!req.query.token) return res.render("recovery", {error: "Token nao identificado", success: null });
        User.findOne({ "recovery.token": req.query.toekn }).then(user => {
            if(!user) return res.render("recovery", { error: "Nao existe usuario com este token", success: null });
            if( new Date(user.recovery.data) < new Date() ) return res.render("recovery", { error: "Token expirado. Tente novamente", success: null });
            return res.render("recovery/store", { error: null, success: null, token: req.query.token  }); 
        }).catch(next);
    }

    // GET /recovered-password
    completeRecovery(req, res, next) {
        const { token, password } = req.body;
        if(!token || !password) return res.render("recovery/store", { error: "Preencha novamente com sua nova senha", success: null, token: token  })
        User.findOne({ "recovery.token": token}).then(user => {
            if(!user) return res.render("recovery", { error: "Usuario nao identificado", success: null });

            user.finalizarTokenRecuperacaoSenha();
            user.setSenha(password);
            return user.save().then(() => {
                return res.render("recovery/store", {
                    error: null,
                    success: "Senha alterada com sucesso. Tente novamente fazer o login",
                    toke: null
                })
            }).catch(next);
        })
    }
}

module.exports = UserController;