import bus from '../utils/bus'

function useFlashMessage() {
    function setFlashMessage(msg, type) {
        bus.emit('flash', {
            message: msg,
            type: type
        })
    }

    return { setFlashMessage }
}

export default useFlashMessage