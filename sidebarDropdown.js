// this keeps the dropdown open when one of the dropdown link is active
var dropdown = document.getElementsByClassName("dropdown-btn");

function dropdownParts(button, fallbackIndex) {
    var suffix = button.id ? button.id.replace("dropdown-btn-", "") : (fallbackIndex + 1).toString();
    return {
        content: document.getElementById("dropdown-list-" + suffix),
        arrowDown: document.getElementById("arrow-down-" + suffix),
        arrowUp: document.getElementById("arrow-up-" + suffix),
        suffix: suffix
    };
}

for (let i = 0; i < dropdown.length; i++) {
    var parts = dropdownParts(dropdown[i], i);
    var dropdownContent = parts.content;
    var arrowDown = parts.arrowDown;
    var arrowUp = parts.arrowUp;
    if (!dropdownContent || !arrowDown || !arrowUp) {
        continue;
    }

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
                const element = document.getElementById("nav-item-" + (j + 1) + "-" + parts.suffix);
                if (element) {
                    element.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
                }
            }
        }
    }
}

// this opens the dropdown when button is clicked
for (let i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function (event) {
        event.preventDefault();
        var parts = dropdownParts(dropdown[i], i);
        var dropdownContent = parts.content;
        var arrowDown = parts.arrowDown;
        var arrowUp = parts.arrowUp;
        if (!dropdownContent || !arrowDown || !arrowUp) {
            return;
        }

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
