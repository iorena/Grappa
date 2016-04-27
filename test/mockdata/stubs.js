const ThesisController = require("../../controllers/thesis");

const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");
const CouncilMeeting = require ("../../models/councilmeeting");
const Grader = require("../../models/grader");
const EthesisToken = require("../../models/ethesisToken");
const StudyField = require("../../models/studyfield");

const EmailReminder = require("../../services/EmailReminder");
const EmailSender = require("../../services/EmailSender");
const tokenGen = require("../../services/TokenGenerator");

const mockDB = require("../mockdata/database");
