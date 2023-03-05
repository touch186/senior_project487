function getSelectionText() {
    var text = "";
        if (this.getSelection) {
            text = this.getSelection().toString();
        } else if (this.selection && this.selection.type != "Control") {
            text = this.selection.createRange().text;
        }
    console.log(text);
    document.getElementById("highlight").value = text;
    return(text);
}


var pageX, pageY;
document.addEventListener("mouseup", () => {
// function copyfieldvalue() {
//   var field = document.getElementById("output");
//   field.focus();
//   field.setSelectionRange(0, field.value.length);
//   document.execCommand("copy");
// }

    let selection = document.getSelection();
    let selectedText = selection.toString();
    var menu = document.querySelector(".menu");
    if (selectedText !== "") {
        let rect = document.querySelector(".text").getBoundingClientRect();
        menu.style.display = "block";
        menu.style.left = pageX - Math.round(rect.left) + "px";
        menu.style.top = pageY - Math.round(rect.top) + 130 + "px";

        // document.getElementById("output").innerHTML = selectedText;

        // var popup = document.getElementById("mypopup");
        // var copybtn = document.getElementById("copy-btn");

        // copybtn.addEventListener("click", () => {
        //   copyfieldvalue();
        //   popup.style.display = "block";
        // });

        // var span = document.getElementsByClassName("close-btn")[0];

        // span.addEventListener("click", () => {
        //   popup.style.display = "none";
        // });

        // window.addEventListener("click", (event) => {
        //   if (event.target == popup) {
        //     popup.style.display = "none";
        //   }
        // });
    } else {
        menu.style.display = "none";
    }
    });
    document.addEventListener("mousedown", (e) => {
    pageX = e.pageX;
    pageY = e.pageY;
});