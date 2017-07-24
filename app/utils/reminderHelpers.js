// Include the Axios library for HTTP requests
const axios = require("axios");
const moment = require('moment');
require('moment-recur');


// Global variables
let displayReminders = [];
let sortedDisplayReminders = [];
let todaysDate = moment().format("MM-DD-YYYY")
let endDate = moment().add(6, 'days').format("MM-DD-YYYY")
let recurrence;
let cal;
const weekdays = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
};


// helper function for reminder component
let reminderHelpers = {

	getCalendar: function(data){

		 return axios.post('/calendar', data);
        
	},

	getReminders: function() {
		displayReminders = [];
		sortedDisplayReminders = [];
		// get request receives user's reminders from backend db query
	    return axios.get("/app/reminders").then(function(results) {
	        // store the data in a variable
	        let data = results.data;
	        // counter used to get index used in setReminder function
	        let displayRemindersIndex = -1;
			// loop through results from DB
			for (let i = 0; i<data.length; i++) {
				for (let j = 0; j<data[i].reminders.length; j++) {
					let newReminder = {
							plant: data[i].name,
							nickname: data[i].nickname,
							type: data[i].reminders[j].reminderType,
							dates: [],
							imageURL: data[i].imageURL
						}
					// increment index counter
					displayRemindersIndex++;
					// push reminder to array
					displayReminders.push(newReminder);
					// and call the setReminder funtion which will generate reminder dates to display in front end
					setReminder(data[i].reminders[j].created, data[i].reminders[j].days, data[i].reminders[j].frequency, displayRemindersIndex);
				}
			}
			// displayReminders array now has all reminders from backend with dates generated based on the user's frequency preferences
			// loop through array and create individual objects for every date generates by setReminder function
			for (let i = 0; i<displayReminders.length; i++) {
				
				for (let j = 0; j<displayReminders[i].dates.length; j++) {
					let date = displayReminders[i].dates[j]
					let newObject = {
						plant: displayReminders[i].plant,
						nickname: displayReminders[i].nickname,
						type: displayReminders[i].type,
						day: moment(date,"MM-DD-YYYY").format("dddd"),
						date: moment(date,"MM-DD-YYYY").format("MM/DD"),
						imageURL: displayReminders[i].imageURL
					}
					// push individual date objects into new array 
					sortedDisplayReminders.push(newObject);
				}
			}
			// sort objects based on date
			sortedDisplayReminders.sort(function(a,b) { 
	    		return new Date(a.date).getTime() - new Date(b.date).getTime() 
			});

			// return to the react component for rendering
			return sortedDisplayReminders
  
    	});	  
   }
};

// function to grab reminder dates based on user settings
function setReminder(createdDate, days, frequency, index) {

	// find the day of the week for that date
	let day = moment(createdDate,"MM-DD-YYYY").format("ddd");
	let allDates;
	// and what week in the month it occurs (1-4)
	let week = moment(createdDate).monthWeek()
	// console.log("----Reminder Information-----")
	// console.log("Created Date: ", createdDate)
	// console.log("Start Date: ", todaysDate)
	// console.log("End Date: ", endDate)
	// console.log("Day: ", day)
	// console.log("===============================")

		// this test works
	if (frequency==="Every week") {
		// using reminder created date, set the weekly recurrence based on selected days 
		recurrence = moment(createdDate).recur(todaysDate, endDate).every(days).daysOfWeek();

		// generate dates
		allDates = recurrence.all("L");
			// loop through resulting array and push to the reminder object
		for (let i = 0; i < allDates.length; i++) {
			displayReminders[index].dates.push(allDates[i])
		}
			// dev function logs the generated recurrence dates
			// logger(days, frequency, allDates)

		// this test works
	}else {
			
		for (let i = 0; i<days.length; i++) {

			let formatCreated = moment(createdDate);
			let dayOfWeek = Number(weekdays[days[i]]);
			let daysToAdd = Math.ceil((formatCreated.day() - dayOfWeek) / 7) * 7 + dayOfWeek;
			let newCreatedDate = moment(formatCreated).startOf('week').add(daysToAdd, 'd');
				
			if (frequency==="Every other week"){
				recurrence = newCreatedDate.recur(endDate).every(14, "days")
				allDates = recurrence.all("L");
					
				for (let i = 0; i < allDates.length; i++) {
					let dateToCompare = new Date(allDates[i])
					let today = new Date(todaysDate)
					if (dateToCompare.getTime() >= today.getTime()) {
						displayReminders[index].dates.push(allDates[i])
					}
				}
					// logger(days, frequency, allDates)
			} else {
				recurrence = newCreatedDate.recur(endDate).every(28, "days")
				allDates = recurrence.all("L");
					
				for (let i = 0; i < allDates.length; i++) {
					let dateToCompare = new Date(allDates[i])
					let today = new Date(todaysDate)
					if (dateToCompare.getTime() >= today.getTime()) {
						displayReminders[index].dates.push(allDates[i])
					};
				};
				// logger(days, frequency, allDates)
			}
		}
	}
}

// function created for development purposes to test accuracy
function logger (days, frequency, dates) {
	console.log("-----Reminder Information-----")
	console.log("Days of the Week: ", days)
	console.log("Frequency: ", frequency)
	console.log("Reminder Dates: ", dates)
	console.log("===============================")
}

// We export the helpers function
module.exports = reminderHelpers;