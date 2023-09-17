const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const api = require('../controllers/api');
const middleware = require('../middleware');
const ajax = require('../controllers/ajax');
const report = require('../controllers/report');
const tracker = require('../controllers/tracker');
const complaint = require('../controllers/complaint');
const { upload } = require('../middleware/upload');


router.get('/',middleware.checkLogin, controller.login);
router.get('/daily', middleware.login, middleware.checkProfile, controller.daily);
router.get('/monthly', middleware.login, middleware.checkProfile, controller.monthly);
router.get('/approvement', middleware.login, controller.approvement);
router.get('/review', middleware.login, controller.review);
router.get('/report', middleware.login, controller.report);
router.get('/contact', middleware.login, controller.getContact); 

router.get('/helpdesk', middleware.login, controller.helpDesk);

router.get('/profile', middleware.login, middleware.checkProfile, controller.profile);

router.get('/logout', middleware.logout);

router.get('/helpDeskAdmin', middleware.login, controller.helpDeskAdmin);

router.post('/api/send-otp', api.sendOtp);
router.post('/api/verify-otp', api.verifyOtp);

router.post('/api/updateProfile', middleware.login, ajax.updateProfile);
router.get('/api/getAnggota', middleware.login, ajax.getAnggota);
router.post('/api/updateBiodata', middleware.login, ajax.updateBiodata);
router.get('/api/getBiodata', middleware.login, ajax.getBiodata);
router.post('/api/postPic', middleware.login, upload.single('image'), ajax.postPic);

router.post('/api/progress', middleware.login, ajax.progress);
router.get('/api/monthly', middleware.login, ajax.monthly);
router.get('/api/monthly/score', middleware.login, ajax.getScore);
router.post('/api/monthly', middleware.login, ajax.createReport);
router.get('/api/monthly/report', middleware.login, ajax.getReport);
router.get('/api/monthly/activity', middleware.login, ajax.getActivity);
router.post('/api/monthly/activity', middleware.login, ajax.updateActivity);
router.delete('/api/monthly/activity', middleware.login, ajax.deleteActivity);
router.get('/api/monthly/signaute', middleware.login, ajax.getSignaute);
router.get('/api/monthly/approvement', middleware.login, ajax.getApprovement);
router.post('/api/monthly/approvement', middleware.login, ajax.signature);
router.get('/api/template', middleware.login, ajax.getTemplate);
router.post('/api/template', middleware.login, ajax.createTemplate);
router.delete('/api/template', middleware.login, ajax.deleteTemplate);

router.get('/api/contact/user', middleware.login, ajax.getProfiles);

router.get('/api/report', middleware.login, report.person);
router.get('/api/report/preview', middleware.login, report.results);

router.post('/api/tracker', middleware.login, tracker.index);

router.post('/api/complaint', middleware.login, complaint.addTiket);
router.get('/api/complaint', middleware.login, complaint.getTiket);
router.get('/api/complaint/detail', middleware.login, complaint.getStatus);
router.post('/api/complaint/status', middleware.login, complaint.setStatus);
router.get('/api/complaint/all', middleware.login, complaint.getAllTiket);
router.get('/api/complaint/updateTiket', middleware.login, complaint.getUpdateTiket);

module.exports = router;