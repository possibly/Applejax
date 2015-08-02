var sqlHandler = require('./sql_handler')

module.exports = function(v_session_id) {
	var eventQue = {
		session_id: v_session_id,
		event_que: [],
		didClientSubmit: function(v_client_id) {
			var flag = false
			event_que.forEach(function(currentValue, index) {
				if (currentValue.client_id == v_client_id) {
					flag = true
				}
			})
			return flag
		},
		addEvent: function(event) {
			event_que.push(event)
		},
		executeQue: function() {
			var i = 0
			while (i<event_que.length) {
				var continueFlag = false
				var currentValue = event_que[i]
				var index = i
				var callback = function() {
					continueFlag = true
				}
				if (currentValue.type=='share' || currentValue.type=='steal') {
					var flag = false
					var otherIndex = -1
					for (l=0; l<event_que.length; l++) {
						if (event_que[l].client_id == currentValue.to_client_id && event_que[l].to_client_id != null) {
							flag = true
							otherIndex = l
							break
						}
					}
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
							sqlHandler.moveClient(currentValue.client_id, newCoordinates, callback)
							break;
						default:
							// do nothing
					}
				}
				
				while (!continueFlag) {
					// wait until loop
				}
			}
		}
	}
	return eventQue
}