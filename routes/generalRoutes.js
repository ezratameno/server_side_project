const { json } = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const Costs = mongoose.model('costs');

module.exports = function generalRoutes(app) {
    // will show the cost items of the user
    app.get("/home",async function(req,res){
        let userCosts = await Costs.findOne({"id": req.session.user.user.id}) 
        res.render("home",{userCosts: userCosts,user: req.session.user.user})
    });


    app.get("/create", (req,res) => {
        res.render("create")
    })

    app.post("/create", async (req,res) => {
        // cost item that we got from the user
        let cost = {
            sum: req.body.sum,
            description: req.body.description,
            category: req.body.category,
            date: req.body.date,
        }

        // find the user by id in costs
        // if not exist than create a new cost entry for the user
        let userCostEntry
        try{
            userCostEntry = await Costs.findOne({"id": req.session.user.user.id})
        } catch(err) {
            res.send(err)
        }

        let entryForUserExist = true;
        // if user not exist
        if (!userCostEntry) {
            entryForUserExist = false;
            // create cost entry
            userCostEntry = {
                id: String,
                costs: Map
            }
            userCostEntry.id = req.session.user.user.id
            userCostEntry.costs = new Map()

        } 

        // month and year
        let date = cost.date.split('-')[1] + "-" + cost.date.split('-')[0]

        // if we don't have entry in the cost collection for this user,
        // than we need to handle the access to the data diffrently
        if (!entryForUserExist) {
            userCostEntry.costs[date] = {
                items: new Array(),
                total: Number 
            }
            userCostEntry.costs[date].total = 0
            userCostEntry.costs[date].items.push(cost)
            // add to the map
            userCostEntry.costs.set(date,{
                items: userCostEntry.costs[date].items,
                total: userCostEntry.costs[date].total += Number(cost.sum)
            });
        } else {
            // if the user already have an entry on the costs collection but don't have in this month and year
            if(typeof userCostEntry.costs.get(date) == 'undefined') {
                userCostEntry.costs.set(date,{
                    items: new Array(),
                    total: 0,
                });
            }
            // update the items and the total amout that we spent in this mont and year
            userCostEntry.costs.get(date).items.push(cost) 
            userCostEntry.costs.get(date).total += Number(cost.sum)

        }
    
        // save into the costs collection
        try {
            const newCostEntry = new Costs(userCostEntry)
            await newCostEntry.save();
        } catch(err) {
            // TODO: create custome errors or error page
            res.send(err)
        }
        res.render("showCost",{cost: cost})
    })
}