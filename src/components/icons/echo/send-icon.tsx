import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SendIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M4.98439 2.30038C3.09555 1.42861 1.07816 3.23427 1.736 5.20783L2.73465 8.16951C2.8432 8.49148 3.14507 8.70824 3.48482 8.70824H10.2917C10.7289 8.70824 11.0834 9.06266 11.0834 9.4999C11.0834 9.93714 10.7289 10.2916 10.2917 10.2916H3.48482C3.14507 10.2916 2.8432 10.5083 2.73465 10.8303L1.73602 13.792C1.07816 15.7655 3.09555 17.5712 4.9844 16.6994L15.9112 11.6563C17.7508 10.8073 17.7508 8.19262 15.9112 7.34353L4.98439 2.30038Z" fill="white" />
    </Svg>
);
export default SendIcon;
