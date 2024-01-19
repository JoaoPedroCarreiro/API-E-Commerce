const clothes = require("./clothes.json")
const wishlist = []
const cart = []

const express = require("express")
const cors = require("cors")
const app = express()

const PORT = 8080

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    return res.status(200).send(clothes)
})

app.get("/wishlist", (req, res) => {
    return res.status(200).send(wishlist)
})

app.post("/wishlist/:id", (req, res) => {
    if(isNaN(Number(req.params.id))) return res.status(400).send("Id must be a number")
    if(wishlist.includes(Number(req.params.id))) return res.status(400).send("Id already is in wishlist")

    wishlist.push(Number(req.params.id))

    return res.status(201).send(wishlist)
})

app.delete("/wishlist/:id", (req, res) => {
    if(isNaN(Number(req.params.id))) return res.status(400).send("Id must be a number")
    if(wishlist.indexOf(Number(req.params.id)) === -1) return res.status(400).send("Wishlist must contains the id")

    wishlist.splice(wishlist.indexOf(Number(req.params.id)), 1)

    return res.status(202).send(wishlist)
})

app.get("/cart", (req, res) => {
    return res.status(200).send(cart)
})

app.post("/cart/item", (req, res) => {
    cart.push(req.body)

    return res.status(201).send(cart)
})

app.delete("/cart/:index", (req, res) => {
    if(isNaN(Number(req.params.index))) return res.status(400).send("Id must be a number")
    if(!cart[req.params.index]) return res.status(400).send("Cart must contains the id")

    cart.splice(Number(req.params.index), 1)

    return res.status(202).send(cart)
})

app.get("/id/:id", (req, res) => {
    const { id } = req.params

    const state = {
        useGender: "",
        useCategorie: "",
        item: {}
    }

    for(const gender in clothes) {
        if(Number(id) < clothes[gender][Object.keys(clothes[gender])[0]][0].id) continue
        state.useGender = gender
    }

    for(const categorie in clothes[state.useGender]) {
        if(Number(id) < clothes[state.useGender][categorie][0].id) continue
        state.useCategorie = categorie
    }

    for(const clothe of clothes[state.useGender][state.useCategorie]) {
        if(Number(id) === clothe.id) {
            state.item = clothe
            continue
        }
    }

    return res.status(200).send({...state.item, gender: state.useGender, categorie: state.useCategorie})
})

app.get("/search=:search", (req, res) => {
    const words = req.params.search.split(" ").filter((i) => i)

    let gender = ""

    for(const tag of words) {
        if(Object.keys(clothes).includes(tag)) {
            gender = tag
            break
        }
    }

    let categorie = ""

    for(const tag of words) {
        for(const key of Object.keys(clothes.feminine)) {
            if(key.startsWith(tag)) {
                categorie = key
                break
            }
        }
    }

    const arrs = (() => { const arr = []; for(let i = 0; i < words.length; i++) arr.push([]); return arr })()
    const arr = []

    for(const _gender in clothes) {
        if(gender) {
            if(gender !== _gender) {
                continue
            }
        }

        for(const _categorie in clothes[_gender]) {
            if(categorie) {
                if(categorie !== _categorie) {
                    continue
                }
            }

            for(const item of clothes[_gender][_categorie]) {
                let contain = 0

                for(const tag of words) {
                    if(item.tags.includes(tag.toLowerCase())) contain++
                }

                if(contain === 0) continue
                arrs[contain - 1].push({ ...item, gender: _gender, categorie: _categorie })
            }
        }
    }

    arrs.reverse()

    for(const array of arrs) {
        for(const item of array) {
            arr.push(item)
        }
    }

    return res.status(200).send(arr)
})

app.get("/:gender", (req, res) => {
    return res.status(200).send(clothes[req.params.gender])
})

app.get("/items/:gender", (req, res) => {
    const arr = []

    for(const categorie in clothes[req.params.gender]) {
        for(const item of clothes[req.params.gender][categorie]) {
            arr.push({...item, gender: req.params.gender, categorie: categorie})
        }
    }

    return res.status(200).send(arr)
})

app.get("/:gender/:clothe", (req, res) => {
    return res.status(200).send((clothes[req.params.gender]) ? clothes[req.params.gender][req.params.clothe] : clothes[req.params.gender])
})

app.get("/items/:gender/:clothe", (req, res) => {
    const categorie = (clothes[req.params.gender]) ? clothes[req.params.gender][req.params.clothe] ? clothes[req.params.gender][req.params.clothe] : [] : []

    const arr = []

    for(const item of categorie) {
        arr.push({...item, gender: req.params.gender, categorie: req.params.clothe})
    }

    return res.status(200).send(arr)
})

app.get("/:gender/:clothe/:id", (req, res) => {
    let item = {}

    if(clothes[req.params.gender] && clothes[req.params.gender][req.params.clothe]) {
        for(const clothe of clothes[req.params.gender][req.params.clothe]) {
            if(Number(req.params.id) === clothe.id) {
                item = clothe
                continue
            }
        }

        return res.status(200).send((Object.keys(item).length === 0) ? null : {...item, gender: req.params.gender, categorie: req.params.clothe })
    }

    return res.status(200).send(null)
})

app.listen(PORT, () => {
    console.log(`API RUNNING ON: http://localhost:${PORT}`)
})