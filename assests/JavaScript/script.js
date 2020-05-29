$(document).ready(function () {

    //creat array of cities
    const cities = ["Sacramento", "New York"];


    //listen for on click for the search button
    $("#search-btn").on("click", function () {

        //get search value
        const searchValue = $("#search-value").val().trim();

        //call out search weather function
        searchWeather(searchValue);

        //put new button to the array
        cities.push(searchValue);

        //render new buttons
        renderButtons();
    })

    //Function that search's for today's weather
    function searchWeather(cityName) {

        //clear out the today div
        $("#today").empty();

        //Query the Api
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=53d2378036e10278637205320c39dd84`
        }).then(function (response) {
            console.log(response);

            //extra data from response
            const name = response.name;
            const wind = response.wind.speed;
            const humidity = response.main.humidity;
            const temperature = response.main.temp;
            const img = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`;

            console.log(name, wind, humidity, temperature, img);
            //create card title
            const titleEl = $("<h3>").addClass("card-title").text(`${name} (${new Date().toLocaleDateString()})`);

            //create the card
            const cardEl = $("<div>").addClass("card");

            //creat card body
            const cardBodyEl = $("<div>").addClass("card-body");

            //data to insert into card
            const windEl = $("<p>").addClass("card-text").text(`Wind Speed: ${wind} MPH`);
            const humidEl = $("<p>").addClass("card-text").text(`Humidity: ${humidity}`);
            const tempEl = $("<p>").addClass("card-text").text(`Tempurature: ${temperature}`);
            const imgEl = $("<img>").attr("src", img);

            //combined out data into our card
            titleEl.append(imgEl);

            //append all data into card body section
            cardBodyEl.append(titleEl, tempEl, humidEl, windEl);

            //append the card body onto the actual card element
            cardEl.append(cardBodyEl);

            //appened onto the actualyt html page so we can see
            $("#today").append(cardEl);

            //get lat
            const latitude = response.coord.lat;

            //get lon
            const longitude = response.coord.lon;

            console.log(latitude, longitude);

            getUVIndex(latitude, longitude);
            getForecast(name);
        })
    }

    function getUVIndex(lat, lon) {

        //call api to get our UV index
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/uvi?appid=53d2378036e10278637205320c39dd84&lat=${lat}&lon=${lon}`
        }).then(function (response) {

            const uvValue = response.value;
            console.log(uvValue);

            const uvEl = $("<p>").text(`UV Index: `);
            const btnEl = $("<span>").addClass("btn btn-sm").text(uvValue);

            //change color of UV vlaue
            if (uvValue < 3) {
                btnEl.addClass("btn-success");
            }

            else if (uvValue < 7) {
                btnEl.addClass("btn-warning");
            }
            else {
                btnEl.addClass("btn-danger");
            }

            //append to btnEl to uvEl
            uvEl.addClass(btnEl);

            uvEl.append(btnEl);

            //append to card-body
            $("#today .card-body").append(uvEl);
        })

    }

    function getForecast(cityName) {
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=53d2378036e10278637205320c39dd84`
        }).then(function (response) {
            console.log(response);

            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast: </h4>").append("<div class=\"row\">");

            //loop over all forecast and generate html
            for (var i = 0; i < 5; i++) {

                //create colomn
                const colEl = $("<div>").addClass("col-md-2");

                //create card
                const cardEl = $("<div>").addClass("card bg-primary text-white");

                //card body
                const cardBodyEl = $("<div>").addClass("card-body p-2");

                //extract data from current element we are on.
                const titleEL = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());
                const imgEl = $("<img>").attr("src", `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`);
                const tempEl = $("<p>").addClass("card-text").text(`Temp: ${response.list[i].main.temp_max}`);
                const humidEl = $("<p>").addClass("card-text").text(`Humidity: ${response.list[i].main.humidity}`);

                //append all data to cardEl

                cardBodyEl.append(titleEL, imgEl, tempEl, humidEl);

                cardEl.append(cardBodyEl);

                //once card is finished, append to our colomn
                colEl.append(cardEl);

                //append colomn to row
                $('#forecast .row').append(colEl);

            }
        })
    }

    function renderButtons() {

        $(".cities").empty();
        for (let i = 0; i < cities.length; i++) {
            //create list items
            const listItem = $("<li>").addClass("current-city list-group-item list-group-item-action").attr("data-city", cities[i]).text(cities[i]);
            $(".cities").append(listItem);
        }




    }
    $(document).on("click", ".current-city", function () {
        const cityName = $(this).attr("data-city");
        searchWeather(cityName);
    })

    //on page load
    renderButtons();

})