module.exports={
  testDir:'./tests',
  use:{baseURL:'http://127.0.0.1:8765',headless:true,trace:'retain-on-failure'},
  projects:[{name:'chromium',use:{browserName:'chromium'}}],
  reporter:'list',
  timeout:30000,
  expect:{timeout:9000}
};
