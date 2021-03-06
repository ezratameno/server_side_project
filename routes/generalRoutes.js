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
        let createFormErrors = {
            sum: "",
            description: "",
            category: "",
        }
        res.render("create",{createFormErrors: checkCreateFormErrors})
    })

    app.post("/create", async (req,res) => {
        // cost item that we got from the user
        let cost = {
            sum: req.body.sum,
            description: req.body.description,
            category: req.body.category,
            date: req.body.date,
        }

        let resulet = checkCreateFormErrors(cost)
        let createFormErrors = resulet[0]
        let isErrors = resulet[1]
        // if there are errors we want to re-render the form
        if (isErrors) {
            res.render("create", {createFormErrors: createFormErrors})
            return
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
                catagories: new Map(),
                total: Number 
            }
            // add to the catagorie the new cost item
            userCostEntry.costs[date].catagories.set(cost.category, new Array(cost))
            // add to the map
            userCostEntry.costs.set(date,{
                catagories: userCostEntry.costs[date].catagories,
                // implament the Computed pattern, so we won't need to recalculate the total each time the user want to get a status
                total: Number(cost.sum)
            });
        } else {
            // if the user already have an entry on the costs collection but don't have in this month and year
            if(typeof userCostEntry.costs.get(date) == 'undefined') {
                userCostEntry.costs.set(date,{
                    catagories: new Map(),
                    total: 0,
                });
            }
            // check if we have the catagory already so we only need to add to the existing array
            if (userCostEntry.costs.get(date).catagories.has(cost.category) ) {
                // add to the catagory the new cost item
                userCostEntry.costs.get(date).catagories.get(cost.category).push(cost) 
            } else {
                userCostEntry.costs.get(date).catagories.set(cost.category,new Array(cost))
            }
            // update the total amout that we spent in this mont and year
            userCostEntry.costs.get(date).total += Number(cost.sum)
        }
    
        // save into the costs collection
        try {
            const newCostEntry = new Costs(userCostEntry)
            await newCostEntry.save();
        } catch(err) {
            res.send(err)
        }
        res.render("showCost",{cost: cost})
    })

    // will check for errors in the create form
    function checkCreateFormErrors(cost) {
        let createFormErrors = {
            sum: "",
            description: "",
            category: "",
        }
        let isErrors 
        isErrors = false
        if (cost.sum == "") {
            createFormErrors.sum = "Must be a non empty field!"
            isErrors = true
        }
        if (isNaN(cost.sum)) {
            createFormErrors.sum = "sum must be a number"
            isErrors = true
        }
        if (!isNaN(cost.sum) && cost.sum < 0) {
            createFormErrors.sum = "sum must a positive number"
            isErrors = true
        }
        if (cost.description == "") {
            createFormErrors.description = "Must be a non empty field!"
            isErrors = true
        }
        if (cost.category == "") {
            createFormErrors.category = "Must be a non empty field!"
            isErrors = true
        }
        return [createFormErrors, isErrors]
    }
}