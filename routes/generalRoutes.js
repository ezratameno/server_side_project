const { json } = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const Costs = mongoose.model('costs');

module.exports = function generalRoutes(app) {
    // will show the cost items of the user
    app.get("/home",function(req,res){
        console.log(req.session)
        res.render("home")
    });


    app.get("/create", (req,res) => {
        res.render("create")
    })

    app.post("/create", async (req,res) => {
        let cost = {
            sum: req.body.sum,
            description: req.body.description,
            category: req.body.category,
            date: req.body.date,
            id: req.session.user.user.id
        }

        // find the user by id in costs
        // if not exist than create a new cost entry
        let userCostEntry
        try{
            userCostEntry = await Costs.findOne({"id": req.session.user.user.id})
        } catch(err) {
            res.send(err)
        }

        // if user not exist
        if (!userCostEntry) {
            // create cost entry
            userCostEntry = {
                id: String,
                costs: Map
            }
            userCostEntry.id = req.session.user.user.id
            userCostEntry.costs = new Map()

        }


        let date = cost.date.split('-')[1] + "-" + cost.date.split('-')[0]
        // if we don't have any entries for this month and year
        if (typeof userCostEntry.costs[date] == 'undefined') {
            userCostEntry.costs[date] = {
                items: new Array(),
                total: Number 
            }
            userCostEntry.costs[date].total = 0 
        }
        userCostEntry.costs[date].items.push(cost)

        // add to the map
        userCostEntry.costs.set(date,{
            items: userCostEntry.costs[date].items,
            total: userCostEntry.costs[date].total += Number(cost.sum)
        })
        
        
        try {
            const newCostEntry = new Costs(userCostEntry)

            console.log(userCostEntry)
            console.log(newCostEntry)

            await newCostEntry.save();
        } catch(err) {
            // TODO: create custome errors or error page
            res.send(err)
        }
      
        res.send(userCostEntry)

        // need to extract the 
    })
}