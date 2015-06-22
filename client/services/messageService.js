angular
	.module('temperasure')
	.factory('messageService', messageService);

messageService.$inject = ['dateService'];

function messageService($meteor, dateService) {
	return {
		createMessage: createMessage
	}

	function createMessage() {
		var newMessage = {
			text: "",
			createdDate: null,
			createdBy: null
		}

		return newMessage;

	}
}