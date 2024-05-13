// this keeps the dropdown open when one of the dropdown link is active
var dropdown = document.getElementsByClassName("dropdown-btn");
for (let i = 0; i < dropdown.length; i++) {
    var dropdownContent = document.getElementById("dropdown-list-" + (i + 1));
    var arrowDown = document.getElementById("arrow-down-" + (i + 1));
    var arrowUp = document.getElementById("arrow-up-" + (i + 1));
    var dropdownContent_children = dropdownContent.children[0].children;
    for (let j = 0; j < dropdownContent_children.length; j++) {
        if (dropdownContent_children[j].className.includes("active")) {
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
                arrowDown.style.display = "block";
                arrowUp.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
                arrowUp.style.display = "block";
                arrowDown.style.display = "none";
                const element = document.getElementById("nav-item-" + (j + 1) + "-" + (i + 1));
                element.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
            }
        }
    }
}

// this opens the dropdown when button is clicked
for (let i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function (event) {
        event.preventDefault();
        var dropdownContent = document.getElementById("dropdown-list-" + (i + 1));
        var arrowDown = document.getElementById("arrow-down-" + (i + 1));
        var arrowUp = document.getElementById("arrow-up-" + (i + 1));
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
            arrowDown.style.display = "block";
            arrowUp.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
            arrowUp.style.display = "block";
            arrowDown.style.display = "none";
        }
    });
}