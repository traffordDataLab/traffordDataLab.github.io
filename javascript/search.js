var wardTopics=document.getElementsByClassName("wardTopic");
var wardNames=document.getElementsByClassName("wardName");

function searchTag() {
    var x = document.getElementById("keyword").value;
    var matchTags= document.getElementsByClassName(x);
    if (matchTags.length > 0) {
        for (var i = 0; i < wardTopics.length; i++) {
            wardTopics[i].style.display = "none";
        }
        for (var i = 0; i < wardNames.length; i++) {
            wardNames[i].style.display = "none";
        }
        for (var i = 0; i < matchTags.length; i++) {
        console.log(matchTags[i].class);
            matchTags[i].style.display = "block";
        }
    }
}

