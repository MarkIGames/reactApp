import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var voice = null;

window.speechSynthesis.onvoiceschanged = function() {
	voice = window.speechSynthesis.getVoices()[3];
};

var gObject = {
  code:     Array(10).fill(null),
  attempts: Array(10).fill(0)
}

function CodeSquare(props) {
	  return (
	    <button className="codeSquare">
	    	{props.value}
	    </button>
	  );
	}

function Square(props) {
	  return (
	    <button className="square" onClick={props.onClick}>
	      {props.value}
	    </button>
	  );
	}

class CodeBox extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  componentDidMount() {
		    // Added two nested requestAnimationFrames
		    requestAnimationFrame(() => {
		      // Firefox will sometimes merge changes that happened here
		      requestAnimationFrame(() => {
		        this.setState({ animate: true });
		        this.componentDidMount();
		      });
		    });
	  }
	  
	  renderCode(i, letter) {
		let newLetter = randomCharacter();
		let returnObject = {};
		
		returnObject = updateCodeBox(i, letter, newLetter); 
	    
		newLetter = returnObject.letter;
		
	    return (
	      <CodeSquare
	        value={newLetter}
	      />
	    );
	  }

	  render() {
		// CPE1704TKS
		  
	    return (
	      <div>
	        <div className="board-row">
	          {this.renderCode(0, 'C')}
	          {this.renderCode(1, 'P')}
	          {this.renderCode(2, 'E')}
	          {this.renderCode(3, '1')}
	          {this.renderCode(4, '7')}
	          {this.renderCode(5, '0')}
	          {this.renderCode(6, '4')}
	          {this.renderCode(7, 'T')}
	          {this.renderCode(8, 'K')}
	          {this.renderCode(9, 'S')}
	        </div>
	      </div>
	    );
	  }
	}

class Board extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      squares: Array(9).fill(null),
	      xIsNext: true,
	    };
	  }

	  handleClick(i) {
	    const squares = this.state.squares.slice();
	    if (calculateWinner(squares) || squares[i]) {
	        return;
	      }
	    squares[i] = this.state.xIsNext ? 'X' : 'O';
	    this.setState({
	    	squares: squares,
	    	xIsNext: !this.state.xIsNext,
	    });
	  }

	  renderSquare(i) {
	    return (
	      <Square
	        value={this.state.squares[i]}
	        onClick={() => this.handleClick(i)}
	      />
	    );
	  }

	  render() {		  
		const futile = theJoshuaFunction(this.state.squares);
	    const winner = calculateWinner(this.state.squares);
	    let status;
	    if (winner) {
	      status = 'Winner: ' + winner;
	    } else {
	      if(futile) {
	    	status = 'A strange game. The only winning move is not to play.';  
	      } else {
	    	  status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	      }
	    }

	    if(futile) {
	    	speak();
		    return (
		  	      <div>
		  	        <div className="status">{status}</div>
		  	        <br/><br/><br/>How about a nice game of chess?
		  	      </div>
		  	    );
	    } else {
		    return (
		  	      <div>
		  	        <div className="status">{status}</div>
		  	        <div className="board-row">
		  	          {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}
		  	        </div>
		  	        <div className="board-row">
		  	          {this.renderSquare(3)}{this.renderSquare(4)}{this.renderSquare(5)}
		  	        </div>
		  	        <div className="board-row">
		  	          {this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}
		  	        </div>
		  	      </div>
		  	    );
	    }
	  }
	}

	class Game extends React.Component {
	  render() {
	    return (
	      <div className="game">
	        <div className="game-board">
	          <Board />
	        </div>
	        <div className="game-info">
	          <div>{/* status */}</div>
	          <ol>{/* TODO */}</ol>
	        </div>
	    	<div className="codeBox">
    			<CodeBox />
    		</div>
	      </div>

	    );
	  }
	}

	// ========================================

	ReactDOM.render(
	  <Game />,
	  document.getElementById('root')
	);

	function calculateWinner(squares) {
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
		      return squares[a];
		    }
		  }
		  return null;
		}
	
	function theJoshuaFunction(squares) {
		if(squares.includes(null)) {
			return false;
		} else {
			return true;
		}
	}	
		
	function randomCharacter() {
	    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    let  randomString = '';
	    for (var i = 0; i < 1; i++) {
	        let randomPoz = Math.floor(Math.random() * charSet.length);
	        randomString += charSet.substring(randomPoz,randomPoz+1);
	    }
	    return randomString;
	}
	
	function updateCodeBox(box, letter, newLetter) {
		let code      = gObject.code;
		let attempts  = gObject.attempts;
		
		let returnObject = {};
		
		if((box == 0 || code[box - 1] != null)) {
			attempts[box] = attempts[box] + 1;
		}

	    if(newLetter == letter && (code[box] == null) && attempts[box] > 200 && (box == 0 || code[box - 1] != null)) {
	    	newLetter = letter;
	    	code[box] = letter;
	    } else {
	    	if((code[box] != null)) {
	    		newLetter = letter;
	    	}
	    }
	    
	    returnObject.letter = newLetter;
	
	    gObject.code     = code;
	    gObject.attempts = attempts;
	    
	    return returnObject;
	}
	
	function speak() {
		var synth = window.speechSynthesis;
	
		var utterThis = new SpeechSynthesisUtterance();
		
		utterThis.text = 'A strange game. The only, winning move, is not, to, play. How about a nice game of chess?';
		utterThis.voice = voice;
		utterThis.pitch = 0.2;
		utterThis.rate = 1;
		
		synth.speak(utterThis);
	}
	