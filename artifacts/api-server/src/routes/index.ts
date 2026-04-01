import { Router, type IRouter } from "express";
import healthRouter from "./health";
import modulesRouter from "./modules";
import lessonsRouter from "./lessons";
import quizzesRouter from "./quizzes";
import badgesRouter from "./badges";
import progressRouter from "./progress";
import dashboardRouter from "./dashboard";
import forumRouter from "./forum";
import caseStudiesRouter from "./caseStudies";

const router: IRouter = Router();

router.use(healthRouter);
router.use(modulesRouter);
router.use(lessonsRouter);
router.use(quizzesRouter);
router.use(badgesRouter);
router.use(progressRouter);
router.use(dashboardRouter);
router.use(forumRouter);
router.use(caseStudiesRouter);

export default router;
