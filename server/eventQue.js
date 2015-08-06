var sqlHandler = require('./sql_handler')
var eventObject = require('./event')

module.exports = function(v_session_id) {
	var eventQue = {
		session_id: v_session_id,
		event_que: [],
		didClientSubmit: function(v_client_id) {
			var flag = false
			this.event_que.forEach(function(currentValue, index) {
				if (currentValue.client_id == v_client_id) {
					flag = true
				}
			})
			return flag
		},
		addEvent: function(event) {
			this.event_que.push(event)
		},
		add: function(json) {
			var eventObj = new eventObject(json.client_id)
			var _this = this
			eventObj.type = json.type
			switch (eventObj.type) {
			case 'move':
				sqlHandler.getClientCoordinates(eventObj.client_id, function(x, y) {
					eventObj.new_coordinates_x = x+parseInt(json.x)
					eventObj.new_coordinates_y = y+parseInt(json.y)
					_this.addEvent(eventObj)
				})
				break
			default:
				console.log(eventObj.type)
			}
		},
		executeQue: function() {
			var i = 0
			var _this = this
			while (i<_this.event_que.length) {
				var continueFlag = false
				var currentValue = _this.event_que[i]
				var index = i
				var splice_array = [index]
				function callback() {
					continueFlag = true
					console.log("hi1")
				}
				if (currentValue.type=='share' || currentValue.type=='steal') {
					var flag = false
					var otherIndex = -1
					for (l=0; l<_this.event_que.length; l++) {
						if (event_que[l].client_id == currentValue.to_client_id && _this.event_que[l].to_client_id != null) {
							flag = true
							otherIndex = l
							break
						}
					}
					splice_array.push(otherIndex)
					function addApples(apples1, apples2) {
						sqlHandler.addApples(currentValue.client_id, currentValue.to_client_id, apples1, apples2, callback)
					}
					if (flag) {
						if (currentValue.type=='share') {
							if (event_que[otherIndex]=='share') {
								addApples(2,2)
							} else {
								addApples(-2, 6)
							}
						} else {
							if (event_que['otherIndex']=='share') {
								addApples(6, -2)
							} else {
								addApples(-2, -2)
							}
						}
					} else {
						
					}
				} else {
					
					switch (currentValue.type) {
						case 'move':
							var newCoordinates = [currentValue.new_coordinates_x, currentValue.new_coordinates_y]
							console.log(currentValue.client_id+" "+currentValue.new_coordinates_x+" "+currentValue.new_coordinates_y)
							sqlHandler.moveClient(currentValue.client_id, newCoordinates, callback)
							callback()
							console.log("hi-in-switch")
							break;
						default:
							// do nothing for now
					}
				}
				
				while (!continueFlag) {
					// wait until loop
					//console.log(continueFlag)
				}
				var splice_count= 0
				for (index in splice_array) {
					_this.event_que.splice(index-splice_count, 1)
					splice_count++
				}
				i++
			}
		}
	}
	return eventQue
}