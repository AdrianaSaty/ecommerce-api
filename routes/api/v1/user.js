const router = require("express").Router();
const auth = require("../../auth");
const UserController = require("../../../controllers/UserController");
const user = require("../../../models/user");

const userController = new UserController();

router.post("/login", userController.login);
router.post("/register", userController.store);
router.post("/", auth.required, userController.update);
router.delete("/", auth.required, userController.remove);

router.get("/recover-password", userController.showRecovery);
router.post("/recover-password", userController.createRecovery);
router.get("/recovered-password", userController.showCompleteRecovery);
router.post("/recovered-password", userController.completeRecovery);

router.get("/", auth.required, userController.index);
router.get("/:id", auth.required, userController.show);

module.exports = router;