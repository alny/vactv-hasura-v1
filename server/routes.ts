const Router = require("nextjs-dynamic-routes");

const router = new Router();

router.add({ name: "clip", pattern: "/clip/:id" });
router.add({ name: "player", pattern: "/player/:id" });
router.add({ name: "team", pattern: "/team/:id" });
router.add({ name: "event", pattern: "/event/:id" });
router.add({ name: "user", pattern: "/user/:id" });

module.exports = router;
