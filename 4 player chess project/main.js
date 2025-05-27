let legalSquares = [];
const BoardSquares = document.getElementsByClassName("square");
let pieces = document.getElementsByClassName("piece");
let piecesImages = document.getElementsByTagName("img");

let turn = true; //true is for white and false is for black

let selectedSquare = BoardSquares[0];
let validPieceSelectedPiece = false;

let whiteKingMoved = false;
let blackKingMoved = false;

let h1rookMoved = false;
let h8rookMoved = false;

let a1rookMoved = false;
let a8rookMoved = false;

//main run
setupBoardSquares();
setupPieces();

//required functions
function setupBoardSquares(){ //sets up all the squares
    for (let i=0;i<BoardSquares.length;i++){
        let row=8-Math.floor(i/8);
        let column = String.fromCharCode(97+(i%8));
        let square = BoardSquares[i];
        square.id = column+row;
        
        BoardSquares[i].addEventListener('click', function(){
            movePiece(selectedSquare.querySelector(".piece"), BoardSquares[i]);
        })
    }
}

function setupPieces(){
    for (let i = 0; i < pieces.length; i++){
        piecesImages[i].addEventListener('click', function(){
            clickPiece(piecesImages[i].parentElement, piecesImages[i].parentElement.id);
        })
    }
}

function resetPieces(){
    for (let i = 0;i < pieces.length; i++){
        piecesImages[i].removeEventListener("click");
    }
}

function clickPiece(piece ,colour){
    if ((colour == "white" && !turn) || (colour == "black" && turn)) {
        return;
    }
    
    let positon = piece.parentElement.id;
    console.log(positon);

    selectedSquare = piece.parentElement;
    validPieceSelectedPiece = true;
}

function movePieceUnrestricted(piece, target){
    //move the piece
    let newPiece = document.createElement("div");
    newPiece.id = piece.id;
    newPiece.className = piece.className;

    target.appendChild(newPiece);

    let newImg = document.createElement("img");
    newImg.src = piece.querySelector("img").src
    newImg.alt = piece.querySelector("img").alt

    newPiece.appendChild(newImg);

    validPieceSelectedPiece = false;

    piece.remove();
}

function checkForCheck(colour){
    check = false;
    if (colour == "white"){
        let whiteKing = document.querySelector(".king#white");

        for (let i = 0; i < pieces.length; i++){
            if (pieces[i].id == "black"){ //check all the black pieces
                let piece = pieces[i];
                let target = whiteKing.parentElement;
                let fileDis = piece.parentElement.id[0].charCodeAt(0) - target.id[0].charCodeAt(0);
                let rankDis = Number(piece.parentElement.id[1]) - Number(target.id[1]);

                let piecePos = piece.parentElement.id;
                let fileAscii = piecePos[0].charCodeAt(0);
                let rank = Number(piecePos[1]);
                if (pieces[i].classList.contains("rook")){ // if its a rook
                    if (fileDis == 0 || rankDis == 0){
                        if (fileDis == 0){
                            let checkIncriment = rankDis / Math.abs(rankDis);

                            for (let x=1; x < Math.abs(rankDis)+1; x++){
                                let newRank = rank - (x * checkIncriment);
                                
                                let checkPos = String.fromCharCode(fileAscii) + String(newRank);

                                let checkSquare = document.getElementById(checkPos);

                                console.log(checkSquare);

                                if (checkSquare.querySelector(".piece")){
                                    if (!(checkSquare.querySelector(".piece").classList.contains("king") && checkSquare.querySelector(".piece").id == "white")){

                                    }
                                    else{
                                        check = true;
                                    }
                                }
                            }
                        }
                        if (rankDis == 0){
                            let checkIncriment = fileDis / Math.abs(fileDis);

                            for (let x=1; x < Math.abs(fileDis)+1; x++){
                                let fileDis = fileAscii - (x * checkIncriment);
                                
                                let checkPos = String.fromCharCode(fileDis) + String(rank);

                                let checkSquare = document.getElementById(checkPos);

                                console.log(checkSquare);

                                if (checkSquare.querySelector(".piece")){
                                    if (!(checkSquare.querySelector(".piece").classList.contains("king") && checkSquare.querySelector(".piece").id == "white")){

                                    }
                                    else{
                                        check = true;
                                    }
                                }
                            }
                        }
                    }
                }
                
            }
        }

        return check;
    }
}

function movePiece(piece, target){
    if (!validPieceSelectedPiece || piece.parentElement.id == target.id){
        return;
    }
    //check if the place is occupied
    let targetOccupied = false;
    let occupiedPiece = target.querySelector(".piece");
    if (target.querySelector(".piece")){
        let occupiedPiece = target.querySelector(".piece");
        if (piece.id == occupiedPiece.id){
            return;
        }else{
            targetOccupied = true;
        }
    }

    //check for rules
    let rankChange = Number(piece.parentElement.id[1]) - Number(target.id[1]);
    rankChange = Math.abs(rankChange);
    let fileChange = Math.abs(piece.parentElement.id[0].charCodeAt(0) - target.id[0].charCodeAt(0));

    if (piece.classList.contains("rook")){
        if (piece.parentElement.id[0] != target.id[0] && piece.parentElement.id[1] != target.id[1]){
            return;
        }

        //check if there is a piece in between the moving piece and target
        //Dis stands for displacement
        let fileDis = piece.parentElement.id[0].charCodeAt(0) - target.id[0].charCodeAt(0);
        let rankDis = Number(piece.parentElement.id[1]) - Number(target.id[1]);

        for (let x = 0; x < pieces.length; x++){
            if (pieces[x].parentElement.id[0] == target.id[0]){
                let piecedir = Number(piece.parentElement.id[1]) - Number(pieces[x].parentElement.id[1])
                if ((piecedir > 0 && rankDis >0)){
                    if (rankDis > piecedir) {
                        return;
                    }
                }else if ((piecedir < 0 && rankDis < 0)){
                    if (rankDis < piecedir) {
                        return;
                    }
                }
            }else if(pieces[x].parentElement.id[1] == target.id[1]){
                let piecedir = piece.parentElement.id[0].charCodeAt(0) - pieces[x].parentElement.id[0].charCodeAt(0);
                if ((piecedir > 0 && fileDis > 0)){
                    if (fileDis > piecedir) {
                        return;
                    }
                }else if ((piecedir < 0 && fileDis < 0)){
                    if (fileDis < piecedir) {
                        return;
                    }
                }
            }
        }
        
    }
    if (piece.classList.contains("bishop")){
        if (fileChange != rankChange){
            return;
        }

        let fileDis = piece.parentElement.id[0].charCodeAt(0) - target.id[0].charCodeAt(0);
        let rankDis = Number(piece.parentElement.id[1]) - Number(target.id[1]);

        let piecePos = piece.parentElement.id;
        let fileAscii = piecePos[0].charCodeAt(0);
        let rank = Number(piecePos[1])

        if (fileDis < 0 && rankDis < 0){
            for (let i = 1; i < Math.abs(fileDis); i++){
                let checkRank = rank + i;
                let checkFile = fileAscii + i;

                let fileStr = String.fromCharCode(checkFile);
                
                let checkPos = fileStr + String(checkRank);

                let targetSquare = document.getElementById(checkPos);
                if (targetSquare.querySelector(".piece")){
                    return;
                }
            }
        }
        if (fileDis > 0 && rankDis > 0){
            for (let i = 1; i < Math.abs(fileDis); i++){
                let checkRank = rank - i;
                let checkFile = fileAscii - i;

                let fileStr = String.fromCharCode(checkFile);
                
                let checkPos = fileStr + String(checkRank);

                let targetSquare = document.getElementById(checkPos);
                if (targetSquare.querySelector(".piece")){
                    return;
                }
            }
        }
        if (fileDis < 0 && rankDis > 0){
            for (let i = 1; i < Math.abs(fileDis); i++){
                let checkRank = rank - i;
                let checkFile = fileAscii + i;

                let fileStr = String.fromCharCode(checkFile);
                
                let checkPos = fileStr + String(checkRank);

                let targetSquare = document.getElementById(checkPos);
                if (targetSquare.querySelector(".piece")){
                    return;
                }
            }
        }
        if (fileDis > 0 && rankDis < 0){
            for (let i = 1; i < Math.abs(fileDis); i++){
                let checkRank = rank + i;
                let checkFile = fileAscii - i;

                let fileStr = String.fromCharCode(checkFile);
                
                let checkPos = fileStr + String(checkRank);

                let targetSquare = document.getElementById(checkPos);
                if (targetSquare.querySelector(".piece")){
                    return;
                }
            }
        }
    }
    if (piece.classList.contains("queen")){
        if ((piece.parentElement.id[0] != target.id[0] && piece.parentElement.id[1] != target.id[1]) && fileChange != rankChange){
            return;
        }

        let fileDis = piece.parentElement.id[0].charCodeAt(0) - target.id[0].charCodeAt(0);
        let rankDis = Number(piece.parentElement.id[1]) - Number(target.id[1]);

        if (Math.abs(fileDis) == Math.abs(rankDis)){ // do the check for bishop
            let piecePos = piece.parentElement.id;
            let fileAscii = piecePos[0].charCodeAt(0);
            let rank = Number(piecePos[1])

            if (fileDis < 0 && rankDis < 0){
                for (let i = 1; i < Math.abs(fileDis); i++){
                    let checkRank = rank + i;
                    let checkFile = fileAscii + i;

                    let fileStr = String.fromCharCode(checkFile);

                    let checkPos = fileStr + String(checkRank);

                    let targetSquare = document.getElementById(checkPos);
                    if (targetSquare.querySelector(".piece")){
                        return;
                    }
                }
            }
            if (fileDis > 0 && rankDis > 0){
                for (let i = 1; i < Math.abs(fileDis); i++){
                    let checkRank = rank - i;
                    let checkFile = fileAscii - i;

                    let fileStr = String.fromCharCode(checkFile);

                    let checkPos = fileStr + String(checkRank);

                    let targetSquare = document.getElementById(checkPos);
                    if (targetSquare.querySelector(".piece")){
                        return;
                    }
                }
            }
            if (fileDis < 0 && rankDis > 0){
                for (let i = 1; i < Math.abs(fileDis); i++){
                    let checkRank = rank - i;
                    let checkFile = fileAscii + i;

                    let fileStr = String.fromCharCode(checkFile);

                    let checkPos = fileStr + String(checkRank);

                    let targetSquare = document.getElementById(checkPos);
                    if (targetSquare.querySelector(".piece")){
                        return;
                    }
                }
            }
            if (fileDis > 0 && rankDis < 0){
                for (let i = 1; i < Math.abs(fileDis); i++){
                    let checkRank = rank + i;
                    let checkFile = fileAscii - i;

                    let fileStr = String.fromCharCode(checkFile);

                    let checkPos = fileStr + String(checkRank);

                    let targetSquare = document.getElementById(checkPos);
                    if (targetSquare.querySelector(".piece")){
                        return;
                    }
                }
            }
        }else{
            if (piece.parentElement.id[0] == target.id[0]){
                for (let i = 0; i < pieces.length; i++){
                    if (pieces[i].parentElement.id[0] == target.id[0]){
                        let piecedir = Number(piece.parentElement.id[1]) - Number(pieces[i].parentElement.id[1])
                        if ((piecedir > 0 && rankDis >0)){
                            if (rankDis > piecedir) {
                                return;
                            }
                        }else if ((piecedir < 0 && rankDis < 0)){
                            if (rankDis < piecedir) {
                                return;
                            }
                        }
                    }else {
                        let piecedir = piece.parentElement.id[0].charCodeAt(0) - pieces[i].parentElement.id[0].charCodeAt(0);
                        if ((piecedir > 0 && fileDis >0)){
                            if (fileDis > piecedir) {
                                return;
                            }
                        }else if ((piecedir < 0 && fileDis < 0)){
                            if (fileDis < piecedir) {
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
    if (piece.classList.contains("king")){
        //check for castling
        let castle = false;
        //short castle on white king
        if (target.id == "g1" && piece.id == "white"){
            console.log("castley castle")
            if (!(whiteKingMoved || h1rookMoved)){
                let g1 = document.getElementById("g1");
                let f1 = document.getElementById("f1");

                if (g1.querySelector(".piece") || f1.querySelector(".piece")){
                    return;
                }

                movePieceUnrestricted(document.getElementById("h1").querySelector(".piece"), document.getElementById("f1"));
                castle = true;
                h1rookMoved = true;
            }
            
        }
        if (target.id == "g8" && piece.id == "black"){
            console.log("castley castle")
            if (!(blackKingMoved || h8rookMoved)){
                let g8 = document.getElementById("g8");
                let f8 = document.getElementById("f8");

                if (g8.querySelector(".piece") || f8.querySelector(".piece")){
                    return;
                }

                movePieceUnrestricted(document.getElementById("h8").querySelector(".piece"), document.getElementById("f8"));
                castle = true;
                h8rookMoved = true;
            }
            
        }
        if (target.id == "c1" && piece.id == "white"){
            console.log("castley castle")
            if (!(whiteKingMoved || a1rookMoved)){
                let c1 = document.getElementById("c1");
                let b1 = document.getElementById("b1");
                let d1 = document.getElementById("d1");

                if (c1.querySelector(".piece") || d1.querySelector(".piece") || b1.querySelector(".piece")){
                    return;
                }

                movePieceUnrestricted(document.getElementById("a1").querySelector(".piece"), document.getElementById("d1"));
                castle = true;
                a1rookMoved = true;
            }
            
        }
        if (target.id == "c8" && piece.id == "black"){
            console.log("castley castle")
            if (!(blackKingMoved || a8rookMoved)){
                let c8 = document.getElementById("c8");
                let b8 = document.getElementById("b8");
                let d8 = document.getElementById("d8");

                if (c8.querySelector(".piece") || d8.querySelector(".piece") || b8.querySelector(".piece")){
                    return;
                }

                movePieceUnrestricted(document.getElementById("a8").querySelector(".piece"), document.getElementById("d8"));
                castle = true;
                a8rookMoved = true;
            }   
        }


        //regular king movement
        if ((rankChange > 1 || fileChange > 1) && castle == false){
            return;
        }
        if (piece.id == "white"){
            whiteKingMoved = true;
        }
        else{
            blackKingMoved = true;
        }
    }
    if (piece.classList.contains("knight")){
        if (!(rankChange == 2 && fileChange == 1 || rankChange == 1 && fileChange == 2)){
            return;
        }
    }
    if (piece.classList.contains("pawn")){
        if (targetOccupied && fileChange != 1){
            return;
        }
        if ((fileChange > 1)){
            return;
        }
        if (fileChange == 1 && !targetOccupied){
            return;
        }
        if (rankChange > 2){
            return;
        }

        if (piece.id == "white"){
            if (target.id[1] < piece.parentElement.id[1]){
                return;
            }
            if (piece.parentElement.id[1] != 2 && rankChange == 2){
                return;
            }
            
        }else{
            if (target.id[1] > piece.parentElement.id[1]){
                return;
            }
            if (piece.parentElement.id[1] != 7 && rankChange == 2){
                return;
            }
        }
    }

    //move the piece
    let newPiece = document.createElement("div");
    newPiece.id = piece.id;
    newPiece.className = piece.className;

    target.appendChild(newPiece);

    let newImg = document.createElement("img");
    newImg.src = piece.querySelector("img").src
    newImg.alt = piece.querySelector("img").alt

    newPiece.appendChild(newImg);

    validPieceSelectedPiece = false;

    /*newPiece.addEventListener('click', function(){
        clickPiece(piecesImages[i].parentElement, piecesImages[i].parentElement.id);
    })*/

    piece.remove();

    if (targetOccupied){
        occupiedPiece.remove();
    }
    
    turn = !turn;
    //resetPieces();
    pieces = document.getElementsByClassName("piece");
    piecesImages = document.getElementsByTagName("img");
    setupPieces();

    console.log(checkForCheck("white"))
}

