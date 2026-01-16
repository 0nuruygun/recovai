const router = require('express').Router();
const { pool, poolConnect, sql } = require('../db');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/loginPost', async (req, res) => {
    const { email, password } = req.body;

    try {
        await poolConnect;
        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query('select * from Coach where Email=@Email');
        if(result.recordset[0].Pass==password){
            res.redirect("../dashboard");
        }
        else{
            return res.render('login', { error: 'E-posta veya şifre hatalı' });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Dashboard error');
    }

    res.redirect('/coach/dashboard');
});

module.exports = router;