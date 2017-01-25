/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);

	// window.addEventListener("beforeunload", function (e) {
	//   e.returnValue = "";
	//   return confirmationMessage;
	// });

	document.addEventListener("DOMContentLoaded", function (event) {
	  $main.init();
	});

	var $main = {
	  gameData: {
	    username: undefined,
	    gameId: undefined,
	    player: undefined,
	    playersList: []
	  },

	  init: function () {
	    this.socket = io();
	    this.domCache();
	    if (this.socket) {
	      this.socket.on('ERROR', this.errorHandler.bind(this));
	      this.socket.on('TEST', this.logTest.bind(this));
	      this.socket.on('updatePlayers', this.render.updatePlayers.bind(this));
	      this.socket.on('updateCharacters', this.render.updateCharacters.bind(this));
	      this.socket.on('inputCharacterDone', this.inputCharacterDone.bind(this));
	      this.socket.on('gameStarted', this.gameStarted.bind(this));
	      this.socket.on('gameCreated', this.gameCreatedJoined.bind(this));
	      this.socket.on('gameJoined', this.gameCreatedJoined.bind(this));
	    }
	  },

	  logTest: function (data) {
	    console.log('<<< TEST >>>')
	    console.log(data)
	  },

	  domCache: function () {
	    this.start_wrapper = document.getElementsByClassName('start-wrapper')[0];
	    this.select_character_wrapper = document.getElementsByClassName('select-character-wrapper')[0];
	    this.start_game_wrapper_owner = document.getElementsByClassName('start-game-wrapper-owner')[0];
	    this.start_game_wrapper_not_owner = document.getElementsByClassName('start-game-wrapper-not-owner')[0];
	    this.new_game_button = document.getElementById('new-game-button');
	    this.join_game_button = document.getElementById('join-game-button');
	    this.input_character_button = document.getElementById('input-character-button');
	    this.game_id = document.getElementById('game-name');
	    this.character_name = document.getElementById('character-name');
	    this.player_name = document.getElementById('player-name');
	    this.players_wrapper = document.getElementById('players-wrapper');
	    this.start_game_button = document.getElementById('start-game-button');
	    this.domListeners();
	  },

	  domListeners: function () {
	    this.new_game_button.addEventListener('click', this.createGame.bind(this));
	    this.join_game_button.addEventListener('click', this.joinGame.bind(this));
	    this.input_character_button.addEventListener('click', this.inputCharacter.bind(this));
	    this.start_game_button.addEventListener('click', this.startGame.bind(this));
	  },

	  startGame: function () {
	    this.socket.emit('startGame', {
	      gameId: this.gameData.gameId
	    })
	  },

	  gameStarted: function () {
	    console.log('lalala')
	    this.render.alertOk('Game started!!!')
	  },

	  createGame: function (e) {
	    this.gameData.username = this.player_name.value;
	    this.gameData.gameId = this.game_id.value;
	    this.socket.emit('createGame', {
	      gameId: this.gameData.gameId,
	      username: this.gameData.username
	    });
	  },

	  gameCreatedJoined: function (data) {
	    this.gameData.player = data.player;
	    this.start_wrapper.classList.add('hidden');
	    this.select_character_wrapper.classList.remove('hidden');
	  },

	  joinGame: function () {
	    this.gameData.username = this.player_name.value;
	    this.gameData.gameId = this.game_id.value;
	    this.socket.emit('joinGame', {
	      gameId: this.gameData.gameId,
	      username: this.gameData.username
	    });
	  },

	  inputCharacter: function () {
	    this.socket.emit('inputCharacter', {
	      gameId: this.gameData.gameId,
	      character: this.character_name.value
	    })
	  },

	  inputCharacterDone: function () {
	    this.select_character_wrapper.classList.add('hidden');
	    if (this.gameData.player.owner)
	      this.start_game_wrapper_owner.classList.remove('hidden');
	    else
	      this.start_game_wrapper_not_owner.classList.remove('hidden');
	  },

	  render: {
	    alertOk: function (message) {
	      console.log(message);
	      alert(message)
	    },
	    alertError: function (message) {
	      console.error(message);
	      alert(message)
	    },
	    updatePlayers: function (players) {
	      this.gameData.playersList = players;
	      this.players_wrapper.innerHTML = "";
	      for (var key in players) {
	        if (players.hasOwnProperty(key)) {
	          var pre = document.createElement('pre');
	          pre.innerHTML = JSON.stringify(players[key], null, 2);
	          this.players_wrapper.appendChild(pre);
	        }
	      }
	    },
	    updateCharacters: function (characters) {
	      console.log(characters)
	    }
	  },

	  errorHandler: function (err) {
	    if (err.code === 'duplicatedGame') {
	      this.render.alertError(err.message);
	      this.gameData.username = undefined;
	      this.gameData.gameId = undefined;
	    }
	    if (err.code === 'noGame') {
	      this.render.alertError(err.message);
	      this.gameData.username = undefined;
	      this.gameData.gameId = undefined;
	    }
	    if (err.code === 'duplicatedCharacter') {
	      this.render.alertError(err.message);
	    }
	    if (err.code === 'unableToStart') {
	      this.render.alertError(err.message);
	    }
	  }

	}


	module.exports = $main;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./main.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "/*--  Reset  -----------------------------------------------------------------*/\r\n*, html{\r\n  margin: 0px;\r\n  padding: 0px;\r\n  box-sizing: border-box;\r\n  font-family: Roboto, FreeSans, Helvetica, Arial, sans-serif;\r\n  color: rgba(255, 255, 255, .6);\r\n  font-size: 16px;\r\n}\r\nbody{\r\n  height: 100vh;\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-around;\r\n  align-items: center;\r\n  font-family: Roboto, FreeSans, Helvetica, Arial, sans-serif;\r\n  color: #333;\r\n  font-size: 16px;\r\n  background-color: #8cc;\r\n  border: 20px solid rgba(255, 255, 255, .6);\r\n  box-shadow: inset 0 0 10px rgba(0, 0, 0, .25);\r\n}\r\nh1{\r\n  font-size: 3rem;\r\n  font-weight: 900;\r\n  text-align: center;\r\n  line-height: 90px;\r\n}\r\nh2{\r\n  font-size: 2rem;\r\n  font-weight: 500;\r\n  text-align: center;\r\n  line-height: 60px;\r\n}\r\n.start-wrapper,\r\n.select-character-wrapper{\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-around;\r\n  align-items: center;\r\n  /*background-color: rgba(255, 255, 255, .6);*/\r\n  width: 50%;\r\n  min-height: 300px;\r\n  border: 10px solid rgba(255, 255, 255, .6);\r\n  box-shadow: 0 8px 20px rgba(0, 0, 0, .25);\r\n  background-color: #8dd;\r\n}\r\n.start-wrapper-section{\r\n  width: 100%;\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: center;\r\n  align-items: center;\r\n}\r\n.users-wrapper{\r\n  width: 50%;\r\n}\r\n.user-card{\r\n  width: 25%;\r\n}\r\n.user-name{\r\n  display: block;\r\n  font-size: 2rem;\r\n}\r\ninput{\r\n  background-color: transparent;\r\n  border-style: none;\r\n  color: #fff;\r\n  font-size: 1.5rem;\r\n  font-weight: 700;\r\n  padding: 20px;\r\n  text-align: center;\r\n}\r\nbutton{\r\n  background-color: transparent;\r\n  /*border: 5px solid #fff;*/\r\n  border-style: none;\r\n  color: rgba(255, 255, 255, .5);\r\n  font-size: 1.5rem;\r\n  font-weight: 700;\r\n  padding: 20px;\r\n  transition: color 300ms ease-out;\r\n}\r\nbutton:hover{\r\n  color: #fff;\r\n}\r\n.hidden{\r\n  display: none;\r\n}\r\n/*--  Placeholders  -----------------------------------------------------------------*/\r\n::-webkit-input-placeholder {\r\n  color: rgba(0, 0, 0, .25);\r\n  font-weight: 500;\r\n}\r\n:-moz-placeholder {\r\n  color: rgba(0, 0, 0, .25);\r\n  font-weight: 500;\r\n}\r\n::-moz-placeholder {\r\n  color: rgba(0, 0, 0, .25);\r\n  font-weight: 500;\r\n}\r\n:-ms-input-placeholder {\r\n  color: rgba(0, 0, 0, .25);\r\n  font-weight: 500;\r\n}", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);