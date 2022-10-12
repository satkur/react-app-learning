import React from 'react';
import ReactDOM from 'react-dom/client';


const SCENE_NAME_TITLE = 'Title';
const SCENE_NAME_STAGE = 'Stage';
const MS_PER_FRAME = 16;

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class PlayerEntity {
    pos;

    constructor(pos) {
        this.pos = pos;
    }
}

function Player(props) {
    return (
        <div style={{
            position: 'absolute',
            top: props.playerEntity.pos.y,
            left: props.playerEntity.pos.x}}>
            @
        </div>
    );
}

class Stage extends React.Component {
    sceneName = SCENE_NAME_STAGE
    timerId = 0;
    
    constructor(props) {
        super(props);
        this.state = {
            playerEntity: new PlayerEntity(new Vector(100, 100))
        }
    }

    // game update
    update() {
        // 座標移動(仮)
        let playerEnt = this.state.playerEntity;
        playerEnt.pos.x = (2 + playerEnt.pos.x) % 800;
        
        this.setState({
            playerEntity: playerEnt
        });

        // call next update
        this.timerId = window.setTimeout(this.update.bind(this), MS_PER_FRAME);
    }

    componentDidMount() {
        this.update();
    }

    componentWillUnmount() {
        clearTimeout(this.timerId);
    }
    
    render() {
        return (
            <>
                <Player playerEntity={this.state.playerEntity} />
                <div>
                    <button onClick={() => this.props.onClickChangeScene(this.sceneName)}>
                        change scene
                    </button>
                </div>
            </>
        );
    }
}

class Title extends React.Component {
    sceneName = SCENE_NAME_TITLE

    render() {
        return (
            <div>
                {SCENE_NAME_TITLE}
                <div>
                    <button onClick={() => this.props.onClickChangeScene(this.sceneName)}>
                        change scene
                    </button>
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: SCENE_NAME_TITLE
        }
    }

    handleClickChangeScene(sceneName) {
        switch (sceneName) {
            case SCENE_NAME_TITLE:
                this.setState({scene: SCENE_NAME_STAGE});
                break;
            case SCENE_NAME_STAGE:
                this.setState({scene: SCENE_NAME_TITLE});
                break;
            default: console.log('invalid scene name');
        }
    }
    
    render() {
        return (
            <div>
                Game
                <div>{
                    this.state.scene === SCENE_NAME_TITLE && 
                    <Title onClickChangeScene={this.handleClickChangeScene.bind(this)} />
                }</div>
                <div>{
                    this.state.scene === SCENE_NAME_STAGE &&
                    <Stage onClickChangeScene={this.handleClickChangeScene.bind(this)} />
                }</div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';


// function Square(props) { // 関数コンポーネント化
//     return (
//         <button
//             className="square"
//             onClick={props.onClick}>
//                 {props.value}
//         </button>
//     );
// }

// class Board extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             squares: Array(9).fill(''),
//             xIsNext: true,
//         };
//     }

//     renderSquare(i) {
//         return (
//             <Square
//                 value={this.props.squares[i]} // stateが変更されると自動的に再レンダーされる
//                 onClick={() => this.props.onClick(i)} />
//         );
//     }

//     render() {
//         return (
//             <div>
//                 <div className="board-row">
//                     {this.renderSquare(0)}
//                     {this.renderSquare(1)}
//                     {this.renderSquare(2)}
//                 </div>
//                 <div className="board-row">
//                     {this.renderSquare(3)}
//                     {this.renderSquare(4)}
//                     {this.renderSquare(5)}
//                 </div>
//                 <div className="board-row">
//                     {this.renderSquare(6)}
//                     {this.renderSquare(7)}
//                     {this.renderSquare(8)}
//                 </div>
//             </div>
//         );
//     }
// }

// class Game extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             history: [{
//                 squares: Array(9).fill(''),
//             }],
//             stepNumber: 0,
//             xIsNext: true,
//         };
//     }

//     handleClick(i) {
//         const history = this.state.history.slice(0, this.state.stepNumber + 1);
//         const current = history[history.length - 1];
//         const squares = current.squares.slice();

//         if (squares[i]|| calculateWinner(squares)) {
//             return;
//         }
        
//         squares[i] = this.state.xIsNext ? 'X' : 'O';
//         this.setState({
//             history: history.concat([{ // history配列に今の盤面を結合
//                 squares: squares,
//             }]),
//             stepNumber: history.length,
//             xIsNext: !this.state.xIsNext,
//         });
//     }

//     jumpTo(step) {
//         this.setState({
//             stepNumber: step,
//             xIsNext: (step % 2) === 0,
//         }); // React は setState で直接指定されたプロパティのみを更新しほかの state はそのまま残す
//     }

//     render() {
//         // ゲーム勝利判定
//         const history = this.state.history;
//         console.log(history.length);
//         const current = history[this.state.stepNumber];
//         const winner = calculateWinner(current.squares);

//         const moves = history.map((step, move) => {
//             const desc = move ?
//                 'Go to move #' + move :
//                 'Go to game start';
//             return (
//                 <li key={move}>
//                     <button onClick={() => this.jumpTo(move)}>{desc}</button>
//                 </li>
//             );
//         });

//         let status;
//         if (winner) {
//             status = 'Winner: ' + winner;
//         } else {
//             status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//         }

//         return (
//             <div className="game">
//                 <div className="game-board">
//                     <Board
//                         squares={current.squares}
//                         onClick={(i) => this.handleClick(i)} />
//                 </div>
//                 <div className="game-info">
//                     <div>{status}</div>
//                     <ol>{moves}</ol>
//                 </div>
//             </div>
//         );
//     }
// }

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<Game />);

// function calculateWinner(squares) {
//     const lines = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8],
//         [0, 4, 8],
//         [2, 4, 6],
//     ];
//     for (let i = 0; i < lines.length; i++) {
//         const [a, b, c] = lines[i];
//         if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//             return squares[a];
//         }
//     }
//     return '';
// }
