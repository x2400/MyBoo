const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require('mysql');
const ap3x = "723058231676633138";


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "discord_bot"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


// i believe there are a lot of things that need to be done but i m bored of this project already(like checking if the key is used or unused and stuff)
// this is not protected agaisnst sql injections i would like someone to try and get all the databases ofc from ur local host and not mine lol
// u can also add delete key or blacklist key cmd here if u would like i cba(they are easy)
// if u r planning to use this u need to work on improving this u can use this, it would be nice if u give credits to but i dont mind if u dont
//ur my sql gotta have a database named discord_bot and in that 2 tables one named "keysys" and one "wl_table" the keysys table needs to have to rows "usedk" and "unusedk" and wl table needs "hwid" "disid" "keyused"
// i also had a wip of communication with the database with express on a server thru express when rblxlua calls it i may include it idk
// the original idea for the above lines was to use express and when the script makes a request it will communitcate with the database check if the given key and hwid and stuff exist there and then pass a succees response it isnt hard to do but i am lazy
// i had also planned to use express to add in ip's if there hwid and key is whitelisted but i also didnt do that cuz i am lazy
//i have not added things such as blacklist because they are simple as deleting there record in the database

//ok this will be it
client.on("message", message => {
    const discid = message.author.id
	let prefix = '$';
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase(); //args part tottaly not copied from stack overflow :33333

    if (command === 'ping') {
        message.channel.send('Yes?');
    } else
    if (command === 'getrole') {
        let disid = message.author.id
        con.query(`SELECT * FROM wl_table WHERE disid = '${disid}'`, function(err, result) {
            if (err) throw err;
            console.log(result.length);
            if (result.length) {
                let role = message.member.guild.roles.cache.find(role => role.name === "Buyer");
                if (role) message.guild.members.cache.get(message.author.id).roles.add(role);
            }
        })
    } else
        //
        if (command === 'redeemkey') {
            let kiy = args[0];
            con.query(`SELECT * FROM keysys WHERE unusedk = '${kiy}'`, function(err, result, fields) {
                if (err) throw err;
                console.log(result.length)
                if (result.length) {
                    console.log('nicceee');
                    con.query(`UPDATE keysys SET usedk = '${kiy}' WHERE unusedk = '${kiy}'`);
                    con.query(`UPDATE keysys SET unusedk = '' WHERE  usedk = '${kiy}'`);
                    message.channel.send('Success.')
                    let role = message.member.guild.roles.cache.find(role => role.name === "Buyer");
                    if (role) message.guild.members.cache.get(message.author.id).roles.add(role);
                    let disid = message.author.id
                    con.query(`INSERT INTO wl_table (disid,keyused) values ('${disid}','${kiy}')`)
                    console.log(result)
                } else {
                    console.log('loser mub')
                    message.channel.send('Invalid Key.')
                }
            }); //got this mf to finaly work
        } else
    if (command === 'whitelist' && message.author.id === ap3x) {
        let miember = message.mentions.members.first();
        let roel = message.guild.roles.cache.find(r => r.name === "Buyer");
        miember.roles.add(roel).catch(console.error); //perfected here stop stop
        message.channel.send('Whitelisted Success/May Already Have Whitelist(lazy to add duplication check)')
    } else
    if (command === 'createkey' && message.author.id === ap3x) {
        let kiy = args[0];
        con.query(`INSERT INTO keysys (unusedk) values ('${kiy}')`)
        message.channel.send('Key Created'); //this part needs to be configured if the result returns smth but i am lazy and gonna release it as is
    } else
    if (command === 'sethwid') {
        let hwid = args[0];
        let disid = message.author.id
        con.query(`UPDATE wl_table SET hwid = '${hwid}' WHERE disid = '${disid}'`, function(err, result, fields) {
            if (err) throw err;
            console.log(result);
            message.channel.send(`${result.affectedRows} Record In The Database Have Been Updated (If The First Number In This Message Is 0 It Means It Didnt Work But Rest Assured Chances Of Failure Are Very Very Low. )`)
        });
    }
});

client.login('MTAzODIzNDY1MDIyMjUzMDYzMA.GorGhO.01zNo5cpQCpLq9HUIdrCqaKj_uHgwDaa9nJsHA');
