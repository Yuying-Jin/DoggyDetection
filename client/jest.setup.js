// jest.setup.js
import { YellowBox } from 'react-native';

// Ignore specific warnings during test runs
YellowBox.ignoreWarnings(['Warning: ...']);

jest.spyOn(global.console, 'warn').mockImplementationOnce((message) => {
    if (!message.includes('componentWillReceiveProps')) {
        global.console.warn(message);
    }
});
