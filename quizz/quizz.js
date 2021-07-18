// UTILS
function isEmpty(map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

// Do not select more than X answers per question
var c_maxAnswersPerQuestion = 3;
$(document).ready(function () {
    $(".questionsHint").text("Sélectionner de 0 à " + c_maxAnswersPerQuestion + " réponses par question.");

    $('.questionsContainer input:checkbox').change(function () {
        IsTooManyAnswersForQuestion($(this));
    });
});

function IsTooManyAnswersForAnyQuestion() {
    var res = false;
    $(".questionBlock").each(function () { res = res | IsTooManyAnswersForQuestion($(this)); });

    return res;
}

function IsTooManyAnswersForQuestion($checkbox) {
    var $questionBlock = $checkbox.closest(".questionBlock");

    // Clear error message
    $questionBlock.find(".questionBlockErrorMessage").remove();

    var res = $questionBlock.find("input:checked").length > c_maxAnswersPerQuestion;

    // Display error message if needed
    if (res)
        $questionBlock.append("<div class='questionBlockErrorMessage'>Trop de réponses sélectionnées !</div>");

    return res;
}

function showResults(result, resultPercent) {
    $(".result").text(result.DisplayName);
    $(".resultPercent").text("(" + resultPercent + "%)");
    $(".imageResult").attr("src", result.ImageUrl);

    $(".questionsContainer").hide();
    $(".resultsContainer").show();

    $(".getResultsButton").hide();
}

function Reset() {
    $('.questionsContainer input:checkbox').prop('checked', false);
    $(".resultsContainer").hide();
    $(".questionsContainer").show();

    $(".generalErrorMessage").text("");

    $(".getResultsButton").show();
    $(".resetButton").show();
}

function GetResults() {

    // Clear error messages
    $(".generalErrorMessage").text("");

    if (IsTooManyAnswersForAnyQuestion()) {
        $(".generalErrorMessage").text("Erreur : trop de réponses à certaines questions.");
        return;
    }

    var dict = {};
    $('.questionsContainer input:checked').each(function () {
        $.each($(this).data(), function (key, value) {
            if (!(key in dict))
                dict[key] = 0;
            if (value)
                dict[key] += value;
        });
    });

    var totalPoints = isEmpty(dict) ? 0 : Object.keys(dict).map(k => dict[k]).reduce(function (a, b) { return a + b });
    var resultKey = isEmpty(dict) ? undefined : Object.keys(dict).reduce(function (a, b) { return dict[a] > dict[b] ? a : b });

    if (!(resultKey in c_allCharacters)) {
        $(".generalErrorMessage").text("Erreur : aucun résultat n'a pu être calculé.");
        return;
    }

    var resultPercent = 100;
    if (totalPoints > 0)
        resultPercent = Math.floor(100 * (dict[resultKey] / totalPoints));
    var result = c_allCharacters[resultKey];
    showResults(result, resultPercent);
}
