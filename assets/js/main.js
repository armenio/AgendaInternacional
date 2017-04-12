Date.prototype.getTimestamp = function () {
    return this.getTime() / 1000;
};


(function ($) {
    $(document).ready(function () {

        var $date = $('#element_date');
        var $city1 = $('#element_city1');
        var $city2 = $('#element_city2');
        var $result = $('#result');
        var $feedback = $('#feedback');

        var BUSINESS_HOURS_INI = 9;
        var BUSINESS_HOURS_END = 18;

        var startDate = new Date();
        var endDate = new Date();
        endDate.setFullYear(startDate.getFullYear() + 1); // soma 1 ano à data atual

        $date.datepicker({
            language: 'pt-BR',
            datesDisabled: [],
            autoclose: true,
            daysOfWeekDisabled: [0, 6],
            startDate: startDate,
            endDate: endDate
        });

        var input1 = document.getElementById('element_city1');
        var input2 = document.getElementById('element_city2');
        var options = {types: ['(cities)']};

        // controla a mudança de cidade pelo autocomplete para não dar conflito com o evento blur
        var placeChanged = false;

        var autocomplete1 = new google.maps.places.Autocomplete(input1, options);
        autocomplete1.addListener('place_changed', function () {
            placeChanged = true;
            autocomplete1.getPlace().selected_address_label = $.trim(input1.value);
            calculateBestTime();
        });

        var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
        autocomplete2.addListener('place_changed', function () {
            placeChanged = true;
            autocomplete2.getPlace().selected_address_label = $.trim(input2.value);
            calculateBestTime();
        });

        /**
         * Impreme as mensagens de sucesso/erro
         *
         * @param mensagem
         * @param classeAntiga
         * @param classeNova
         */
        var showFeedback = function (mensagem, classeAntiga, classeNova) {
            var $alert = $feedback.find('.alert');
            $alert.text(mensagem);
            $alert.addClass('alert-' + classeNova);
            $alert.removeClass('alert-' + classeAntiga);
            $feedback.removeClass('hidden');
        };

        /**
         * Usado para formatar o horário em AM/PM
         *
         * baseado em http://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format?answertab=oldest#tab-top
         *
         * @param hours
         * @param minutes
         * @param seconds
         * @returns {{hours: (string|*), minutes: (string|*), seconds: (string|*), ampm: string, formatted: string}}
         */
        var formatAMPM = function (hours, minutes, seconds) {
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'

            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

            return {
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                ampm: ampm,
                formatted: strTime
            };
        };

        /**
         * Imprime as cidade e os horários da reunião
         *
         * @param time1
         * @param time2
         */
        var showBestTime = function (time1, time2) {
            time1 = formatAMPM(time1, 0, 0);
            time2 = formatAMPM(time2, 0, 0);

            var formattedDate = $date.datepicker('getFormattedDate');

            var $local1 = $result.find('.local1');
            var $local2 = $result.find('.local2');

            $local1.find('.city').text($city1.val());
            $local1.find('.date').text(formattedDate);
            $local1.find('.hours').text(time1.hours + ':' + time1.minutes);
            $local1.find('.ampm').text(time1.ampm);

            $local2.find('.city').text($city2.val());
            $local2.find('.date').text(formattedDate);
            $local2.find('.hours').text(time2.hours + ':' + time2.minutes);
            $local2.find('.ampm').text(time2.ampm);

            $result.removeClass('hidden');
        };

        /**
         * Verifica se um local do autocomplete é válido
         *
         * @param place objeto place selecionado no autocomplete
         * @returns {boolean}
         */
        var isValidPlace = function (place) {
            if (place && place.geometry && place.geometry.location) {
                return true;
            }
            return false;
        };

        /**
         * Verifica se uma cidade é válida
         *
         * @param city
         * @param place objeto place selecionado no autocomplete
         * @returns {boolean}
         */
        var isValidCity = function (city, place) {
            city = $.trim(city);

            if (isValidPlace(place) && city !== '' && place.selected_address_label && place.selected_address_label == city) {
                return true;
            }

            return false;
        };

        /**
         * Retorna o offset em horas de uma cidade
         *
         * @param place objeto place selecionado no autocomplete
         * @param timestamp
         * @returns {*}
         */
        var getTimezoneOffset = function (place, timestamp) {
            var timezoneOffset = null;

            if (!isValidPlace(place)) {
                return timezoneOffset;
            }

            var location = place.geometry.location;

            $.ajax({
                async: false,
                method: 'GET',
                url: 'https://maps.googleapis.com/maps/api/timezone/json',
                data: {
                    location: location.lat() + ',' + location.lng(),
                    timestamp: timestamp,
                    key: 'AIzaSyBdKcOOJljK0GCbqaM5EzsSkJorY7ZLsFo'
                },
                dataType: 'json',
                success: function (data) {
                    timezoneOffset = (data.rawOffset + data.dstOffset) / 60 / 60;
                }
            });

            return timezoneOffset;
        };

        /**
         * Procedimento principal que faz a validação e chama outros métodos para calcular e imprimir os melhores horários para reuniões
         */
        var calculateBestTime = function () {

            $result.addClass('hidden');
            $feedback.addClass('hidden');

            var date = $date.datepicker('getDate');

            if (!date) {

                if ($.trim($date.val()) !== '') {
                    showFeedback('A data é inválida', 'success', 'danger');
                }

                return;
            } else {
                date.setUTCHours(0); // zera as horas para não dar problema no novo horário
                var timestamp = date.getTimestamp();

                var place1 = autocomplete1.getPlace();
                var place2 = autocomplete2.getPlace();

                var city1 = $city1.val();
                var city2 = $city2.val();

                var timezoneOffset1 = getTimezoneOffset(place1, timestamp);
                var timezoneOffset2 = getTimezoneOffset(place2, timestamp);

                //console.log([timezoneOffset1,timezoneOffset2]);

                if (timezoneOffset1 === null || !isValidCity(city1, place1)) {

                    if ($.trim(city1) !== '') {
                        showFeedback('Sua cidade é inválida', 'success', 'danger');
                    }

                    return;
                } else if (timezoneOffset2 === null || !isValidCity(city2, place2)) {

                    if ($.trim(city2) !== '') {
                        showFeedback('A cidade da outra pessoa é inválida', 'success', 'danger');
                    }

                    return;
                } else {
                    $feedback.addClass('hidden');

                    var difference = Math.abs(timezoneOffset1 - timezoneOffset2);

                    if (difference > (BUSINESS_HOURS_END - BUSINESS_HOURS_INI)) {
                        showFeedback('Os horários são incompatíveis com ' + difference + ' horas de diferença :d', 'success', 'danger');
                    } else {
                        showFeedback('Os horários são compatíveis ' + (difference == 0 ? 'sem diferença de horário' : ('com ' + (difference < 4 ? 'apenas ' : '') + difference + ' hora' + (difference > 1 ? 's' : '') + ' de diferença')) + ' :D', 'danger', 'success');

                        if (timezoneOffset1 > timezoneOffset2) {
                            showBestTime(BUSINESS_HOURS_INI, BUSINESS_HOURS_INI + difference);
                        } else {
                            showBestTime(BUSINESS_HOURS_INI + difference, BUSINESS_HOURS_INI);
                        }
                        setTimeout(function () {
                            $.scrollTo($feedback, 600, {offset: {top: -100}});
                        }, 600);
                    }
                }
            }

        };

        /**
         * Usado no evento blur dos campos de cidade, para evitar conflito com o evento place_changed do autocomplete
         */
        var calculateBestTimeDelay = function () {
            setTimeout(function () {
                if (!placeChanged) {
                    calculateBestTime();
                }
                placeChanged = false;
            }, 600);
        };

        $date.on('changeDate', function () {
            calculateBestTime();
        });

        $city1.on('blur', function () {
            calculateBestTimeDelay();
        });

        $city2.on('blur', function () {
            calculateBestTimeDelay();
        });
    });
})(jQuery);