// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import styled from 'styled-components';

const MapboxLogo = styled.a`
  background-image: url("data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 790 180%22%3E%3Cpath d%3D%22M89.1 1.8C39.9 1.8 0 41.7 0 90.9 0 140.1 39.9 180 89.1 180c49.2 0 89.1-39.9 89.1-89.1 0-49.2-39.9-89.1-89.1-89.1zm457.8 19.7c-1.2 0-2.2 1-2.2 2.2v103.2c0 1.2 1 2.2 2.2 2.2h13.4c1.2 0 2.2-1 2.2-2.2v-7.1c6.9 7.2 16.4 11.3 26.3 11.3 20.9 0 37.9-18 37.9-40.3 0-22.3-17-40.2-37.9-40.2-10 0-19.5 4.1-26.3 11.3V23.7c0-1.2-1-2.2-2.2-2.2h-13.4zM98.3 36.4c11.4.3 22.9 4.8 31.7 13.7 17.7 17.7 18.3 45.7 1.4 62.7-30.5 30.5-84.8 20.7-84.8 20.7s-9.8-54.3 20.7-84.8c8.5-8.4 19.7-12.5 31-12.3zm160.3 14.2c-8.2 0-15.9 4-20.8 10.6v-6.4c0-1.2-1-2.2-2.2-2.2h-13.4c-1.2 0-2.2 1-2.2 2.2V127c0 1.2 1 2.2 2.2 2.2h13.4c1.2 0 2.2-1 2.2-2.2V83.8c.5-9.7 7.2-17.3 15.4-17.3 8.5 0 15.6 7.1 15.6 16.5v44c0 1.2 1 2.2 2.2 2.2h13.5c1.2 0 2.2-1 2.2-2.2l-.1-44.9c1.2-8.8 7.6-15.6 15.3-15.6 8.5 0 15.6 7.1 15.6 16.5v44c0 1.2 1 2.2 2.2 2.2h13.5c1.2 0 2.2-1 2.2-2.2l-.1-49.6c.3-14.8-12.3-26.8-27.9-26.8-10 .1-19.2 5.9-23.5 15-5-9.3-14.7-15.1-25.3-15zm127.9 0c-20.9 0-37.9 18-37.9 40.3 0 22.3 17 40.3 37.9 40.3 10 0 19.5-4.1 26.3-11.3v7.1c0 1.2 1 2.2 2.2 2.2h13.4c1.2 0 2.2-1 2.2-2.2V54.8c.1-1.2-.9-2.2-2.2-2.2H415c-1.2 0-2.2 1-2.2 2.2v7.1c-6.9-7.2-16.4-11.3-26.3-11.3zm106.1 0c-10 0-19.5 4.1-26.3 11.3v-7.1c0-1.2-1-2.2-2.2-2.2h-13.4c-1.2 0-2.2 1-2.2 2.2V158c0 1.2 1 2.2 2.2 2.2h13.4c1.2 0 2.2-1 2.2-2.2v-38.2c6.9 7.2 16.4 11.3 26.3 11.3 20.9 0 37.9-18 37.9-40.3 0-22.3-17-40.2-37.9-40.2zm185.5 0c-22.7 0-41 18-41 40.3 0 22.3 18.4 40.3 41 40.3s41-18 41-40.3c0-22.3-18.3-40.3-41-40.3zm45.4 2c-1.1 0-2 .9-2 2 0 .4.1.8.3 1.1l23 35-23.3 35.4c-.6.9-.4 2.2.6 2.8.3.2.7.3 1.1.3h15.5c1.2 0 2.3-.6 2.9-1.6l13.8-23.1 13.8 23.1c.6 1 1.7 1.6 2.9 1.6h15.5c1.1 0 2-.9 2-2 0-.4-.1-.7-.3-1.1L766 90.7l23-35c.6-.9.4-2.2-.6-2.8-.3-.2-.7-.3-1.1-.3h-15.5c-1.2 0-2.3.6-2.9 1.6l-13.5 22.7-13.5-22.7c-.6-1-1.7-1.6-2.9-1.6h-15.5zM99.3 54l-8.7 18-17.9 8.7 17.9 8.7 8.7 18 8.8-18 17.9-8.7-17.9-8.7-8.8-18zm290.3 12.7c12.7 0 23 10.7 23.2 23.9v.6c-.1 13.2-10.5 23.9-23.2 23.9-12.8 0-23.2-10.8-23.2-24.2 0-13.4 10.4-24.2 23.2-24.2zm99.8 0c12.8 0 23.2 10.8 23.2 24.2 0 13.4-10.4 24.2-23.2 24.2-12.7 0-23-10.7-23.2-23.9v-.6c.2-13.2 10.5-23.9 23.2-23.9zm96.3 0c12.8 0 23.2 10.8 23.2 24.2 0 13.4-10.4 24.2-23.2 24.2-12.7 0-23-10.7-23.2-23.9v-.6c.2-13.2 10.5-23.9 23.2-23.9zm92.2 0c12.8 0 23.2 10.8 23.2 24.2 0 13.4-10.4 24.2-23.2 24.2-12.8 0-23.2-10.8-23.2-24.2 0-13.4 10.4-24.2 23.2-24.2z%22 fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E%0A");
  background-size: 99px 28px;
  background-repeat: no-repeat;
  width: 100px;
  display: inline-block;
  height: 28px;
  flex-shrink: 0;
  margin-left: 30px;
`;

export default MapboxLogo;
