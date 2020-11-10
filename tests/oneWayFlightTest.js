module.exports = {
    '@tags': ['unitedAirlines'],
    'United Airlines - One Way flight': function (browser) {
        var myJson = [];
        var flightObject = {};
        var length = 0;
        var table;

        browser
            .windowMaximize()
            .url('https://www.united.com/en/us')
            .waitForElementVisible('body')
            .assert.title('United Airlines - Airline Tickets, Travel Deals and Flights')
            .click('input[id="oneway"][value="on"]')
            .pause(500)

            .setValue('input[type=text]', ['', [browser.Keys.CONTROL, "a"]])
            .keys('\uE017')
            .setValue('#bookFlightOriginInput', 'NYC')
            .setValue('#bookFlightDestinationInput', 'MIA')

            .setValue('#DepartDate', ['', [browser.Keys.CONTROL, "a"]])
            .keys('\uE017')
            .setValue('#DepartDate', 'Aug 20')

            .execute(function (selector) {
                document.querySelector(selector).click();
            }, ['div[aria-label="Economy"]'])

            .execute(function (selector) {
                document.querySelector(selector).click();
            }, ['button[type="submit"]']).pause(10000)

            .waitForElementPresent('#fl-results')
            .waitForElementVisible('#column-ECONOMY')

            .execute(function (selector) {
                document.querySelector(selector).click();
            }, ['#column-ECONOMY > div']).pause(3000)

            .moveToElement('#a-results-show-all', 10, 10)
            .waitForElementVisible('#a-results-show-all', 500)
            .execute(function (selector) {
                document.querySelector(selector).click();
            }, ['a[id="a-results-show-all"]']).pause(3000)

            .elements('css selector', '#flight-result-list-revised > li', function (elementsCount) {
                length = elementsCount.value.length;
                table = elementsCount.valueOf()
            })

            //TODO collect and print json
            .perform(function () {
                    console.log(length);
                    for (var i = 1; i <= length; i++) {
                        browser.elements('css selector', '#flight-result-list-revised > li:nth-child(' + i + ') > div.flight-block-summary-container > div.lof-summary.flight-summary > div.flight-summary-top > div.flight-time.flight-time-depart', function (result1) {
                            result1.value.map(function (element1) {
                                browser.elementIdAttribute(element1.ELEMENT, 'innerText', function (depart) {
                                    flightObject.depart = depart.value;
                                })
                            })
                        });

                        browser.elements('css selector', '#flight-result-list-revised > li:nth-child(' + i + ') > div.flight-block-summary-container > div.lof-summary.flight-summary > div.flight-summary-top > div.flight-time.flight-time-arrive', function (result2) {
                            result2.value.map(function (element2) {
                                browser.elementIdAttribute(element2.ELEMENT, 'innerText', function (arrive) {
                                    flightObject.arrive = arrive.value;
                                })
                            })
                        });

                        browser.elements('css selector', '#flight-result-list-revised > li:nth-child(' + i + ') > div.flight-block-summary-container > div.lof-summary.flight-summary > div.flight-summary-top > div.flight-connection-container > div', function (result3) {
                            result3.value.map(function (element3) {
                                browser.elementIdAttribute(element3.ELEMENT, 'innerText', function (stops) {
                                    flightObject.stops = stops.value;
                                })
                            })
                        });

                        browser.elements('css selector', '#flight-result-list-revised > li:nth-child(' + i + ') > div.flight-block-summary-container > div.lof-summary.flight-summary > div.flight-summary-bottom > a', function (result4) {
                            result4.value.map(function (element4) {
                                browser.elementIdAttribute(element4.ELEMENT, 'innerText', function (duration) {
                                    flightObject.duration = duration.value;
                                })
                            })
                        });

                        browser.elements('xpath', '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[1]/section[6]/div/ul/li[' + i + ']/div[4]/div[2]/div/div/div[2]', function (result5) {
                            result5.value.map(function (element5) {
                                browser.elementIdAttribute(element5.ELEMENT, 'innerText', function (price) {
                                    flightObject.price = price.value;
                                    myJson.push(flightObject);
                                    myJson = myJson.filter(function (v) {
                                        return v.price != 'Not available';
                                    });
                                    console.log(JSON.parse(JSON.stringify(myJson).replace(/\\n/g, ' ')));
                                })
                            })
                        });
                    }
                }
            )
            .end();
    }
}
