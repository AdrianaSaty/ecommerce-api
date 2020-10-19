const router = require("express").Router();
const auth = require("../../auth");
const UsuarioController = require("../../../controllers/UsuarioController");
const usuarioController = new UsuarioController();

const Validation = require("express-validation");
const { UsuarioValidation } = require("../../../controllers/validacoes/usuarioValidation");


router.post("/login", Validation(UsuarioValidation.login), usuarioController.login);
router.post("/registrar", usuarioController.store);
router.put("/", auth.required, usuarioController.update);
router.delete("/", auth.required, usuarioController.remove);

router.get("/recuperar-senha", usuarioController.showRecovery);
router.post("/recuperar-senha", usuarioController.createRecovery);
router.get("/senha-recuperada", usuarioController.showCompleteRecovery);
router.post("/senha-recuperada", usuarioController.completeRecovery);

router.get("/", auth.required, usuarioController.index);
router.get("/:id", auth.required, usuarioController.show)

module.exports = router;