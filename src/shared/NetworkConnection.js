import {NetInfo} from 'react-native';

let _isConnected = true;
let _isHandlerRegistered = false;

async function getConnection() {
    if (_isHandlerRegistered) {
        return _isConnected;
    } else {
        registerHandler();
        _isConnected = await _getConnectionInfo();
        return _isConnected;
    }
}

function registerHandler() {
    NetInfo.isConnected.addEventListener(
        'connectionChange',
        _handleConnectionInfo
    );
    _isHandlerRegistered = true;
}

async function _getConnectionInfo() {
    return await NetInfo.isConnected.fetch();
}

function removeHandler() {
    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        _handleConnectionInfo
    );
    _isHandlerRegistered = false;
}

function _handleConnectionInfo(isConnected) {
    _isConnected = isConnected;
    return _isConnected;
}

export default {
    getConnection,
    removeHandler,
    registerHandler
};