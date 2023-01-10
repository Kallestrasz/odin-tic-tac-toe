const gameBoard = (() => {
    let fieldsArr = Array.from(document.querySelectorAll(".field"));
    let boardArr = [" "," "," ",
                    " "," "," ",
                    " "," "," "]
    function display(){
        for (let i = 0; i < boardArr.length; i++) {
            fieldsArr[i].innerText = boardArr[i]; 
        }
    }
    function clicking(){
        for (let i = 0; i < fieldsArr.length; i++) {
            fieldsArr[i].addEventListener("click", (event) => {
                if (boardArr[i] === "X") {
                    boardArr[i] = "O";
                }
                else{
                    boardArr[i] = "X";
                }
                display();
            });
        }
    }
    return{clicking, display}
})();



gameBoard.display();
gameBoard.clicking();