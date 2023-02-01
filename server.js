const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const path = require("path")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")



require("dotenv").config()


app.use(bodyParser.json({limit: '99999mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '99999mb', extended: true}))

const Player = require("./mongoose/models/Player")

// app.get("/api/players", (req, res)=>{
//     res.send(players)
// })

app.post("/api/update-spots", async (req, res)=>{
    let {time} = req.body
    let namePlayer = req.body.namePlayer.toLowerCase()
    let player = await Player.findOne({namePlayer})
    let spotPassed = player.timeRecord
    if(time > spotPassed) return res.status(200).send({})
    Player.updateOne({namePlayer}, {timeRecord: time}).then(status=>{
        return res.status(200).send({message: "Sua Pontuação/tempo foi salva com sucesso!", err: false})
    }).catch(err=>{
        console.log(err)
        return res.status(500).send({message: "Ocorreu um erro ao salvar o seu pontuação/tempo! Entre em contato com o desenvolvedor do game.", err: true})
    })

})

app.post("/api/add-player", async (req, res)=>{
    let namePlayer = req.body.namePlayer.toLowerCase()
    if(namePlayer.length > 10) return res.send({message: "O nome do player não pode ter mais que 10 caracteres!", err: true})
    let player = await Player.findOne({namePlayer})

    if(player) return res.send({message: "Esse nome já está cadastrado! Tente outro...", err: true})

    let newPlayer = new Player({namePlayer})
    newPlayer.save()
    res.status(200).send({message: "Você está registrado em nosso sistema de ranking! Agora é só jogar e alcançar o primeiro lugar :)", err: false})
})





app.get("/api/players-ranking", async (req, res)=>{
    try{
        let players = await Player.find({})
        let playersOrderTime = players.sort((a, b)=> a.timeRecord - b.timeRecord)
        let playersList = playersOrderTime.filter((p, i)=> i <= 20)
        res.status(200).send({message: "Players no ranking resgatados com sucesso!", data: {playersList}, err: false})
    }   
    catch(err){
        console.log(err)
        res.status(500).send({message: "Houve algum erro ao resgatar a lista de jogadores no ranking!", err: true})
    }
})



if(process.env.NODE_ENV != "development"){
    app.use(express.static(path.join(__dirname, "client/build")))
    app.get("*", (req, res)=> res.sendFile(path.join(__dirname, "client/build/index.html", err=> err ? res.status(500).send(err) : 0)))

    
}

mongoose.set('strictQuery', false)
mongoose.connect(process.env.NODE_ENV != "development" ? process.env.MONGO_CONNECTION_URL : process.env.MONGO_CONNECTION_DEV, (err)=> err ? console.log(err) : console.log("------------> BANCO DE DADOS CARREGADO"))
app.listen(PORT, ()=> console.log("Servidor rodando na porta " + PORT))

