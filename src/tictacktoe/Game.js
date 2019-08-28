/**
 * Created by handri on 2019/08/11.
 */
import React from 'react';

function Move(props) {
    return (
        <li key={props.move}>
            <button onClick={props.onClick} className={props.cssClass}>{props.desc}</button>
        </li>
    );
}

function Square(props) {
    return (
        <button className={props.className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, winner) {
        const winnerCss = winner ? 'winner-square' : 'square';
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                className={winnerCss}
            />
        );
    }

    render() {
        const winners = calculateWinningSquares(this.props.squares);

        let div = [];

        for (let i = 0; i < 8; i = i + 3) {
            let row = [];
            for (let j = i; j < i + 3; j++) {
                row.push(this.renderSquare(j, winners.includes(j)));
            }
            div.push(<div className="board-row">{row}</div>);
        }

        return div;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                changedSquare: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            historyAsc: true,
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat({
                squares: squares,
                changedSquare: i,
            }),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    renderMove(i) {
        const changedSquare = this.state.history[i].changedSquare;
        const row = parseInt(changedSquare / 3) + 1;
        const col = (changedSquare % 3) + 1;
        const desc = i ? `Go to move #${i}: Row[${row}], Col[${col}]` : 'Go to game start';
        const cssClass = i === this.state.stepNumber ? "selected-step" : "";
        return (
            <Move
                move={i}
                onClick={() => this.jumpTo(i)}
                cssClass={cssClass}
                desc={desc}
            />
        );
    }

    renderMoves(history) {
        const moves = history.map((step, move) => {
            return this.renderMove(move);
        });

        if (this.state.historyAsc) {
            return moves;
        } else {
            return moves.reverse();
        }
    }

    toggleHistoryAsc() {
        this.setState({
            historyAsc: !this.state.historyAsc,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = this.renderMoves(this.state.history);
        const order = this.state.historyAsc ? 'ASC' : 'DESC';

        const board = <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}/>;

        let status;
        let winnerCss = '';
        if (winner) {
            status = `Congrats! ${winner} wins!`;
            winnerCss = 'winner'
        } else if (this.state.stepNumber === 9) {
            status = "Draw"
        } else {
            status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    {board}
                </div>
                <div className="game-info">
                    <div className={winnerCss}>{status}</div>
                    <img src="confetti.jpg" class={winnerCss} alt="Confetti"/>
                    <p>Move history <button onClick={() => this.toggleHistoryAsc()}>{order}</button></p>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = calculateWinningSquares(squares);
    if (lines.length > 0) {
        return squares[lines[0]];
    }

    return null;
}

function calculateWinningSquares(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return [];
}

export default Game;
