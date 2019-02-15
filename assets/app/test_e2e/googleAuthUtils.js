module.exports = function (ai, fe, se, cb) {
    ai.windowHandles(function (result) {
        var handle = result.value[1];
        ai.switchWindow(handle);
        ai.pause(6000);
        ai.element('xpath', "//div[contains(text(),'Use another account')]", function(useAnotherAccount) {
            if (useAnotherAccount.status !== -1) {
                ai.useXpath().click("//div[contains(text(),'Use another account')]").useCss()
            }
        });
        ai.pause(500);
        ai.element('css selector', "#identifierId", function (visible) {
            if (visible.status == -1) {
                ai.waitForElementVisible('#Email', 20000);
                ai.setValue('#Email', [fe, ai.Keys.ENTER]);
                ai.waitForElementVisible('#Passwd', 20000);
                ai.setValue('#Passwd', [se, ai.Keys.ENTER]);
                ai.pause(4000); //account-email-0
                ai.windowHandles(function (result) {
                    if (result.value.length == 1) {
                        ai.switchWindow(result.value[0]);
                        cb(true);
                    }
                    else {
                        ai.pause(3000);
                        ai.element('xpath', "//a[contains(text(),'Advanced')]", function (appIsNotVerified) {
                            if (appIsNotVerified.status === -1) {
                                ai.element('css selector', "#account-email-0", function (askForAccount) {
                                    if (askForAccount.status === -1) { // is not visible
                                        ai.element('css selector', "#submit_approve_access", function (visible) {
                                            if (visible.status === -1) { // is not visible
                                                handle = result.value[0];
                                                ai.switchWindow(handle);
                                                cb(false);
                                            }
                                            else {
                                                ai.click('#submit_approve_access');
                                                handle = result.value[0];
                                                ai.switchWindow(handle);
                                                ai.windowHandles(function (result) {
                                                    if (result.value.length == 1) {
                                                        cb(true);
                                                    }
                                                    else {
                                                        cb(false);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    else {
                                        ai.click('#account-email-0');
                                        handle = result.value[0];
                                        ai.switchWindow(handle);
                                        ai.windowHandles(function (result) {
                                            if (result.value.length == 1) {
                                                cb(true);
                                            }
                                            else {
                                                cb(false);
                                            }
                                        })
                                    }
                                });
                            }
                            else {
                                ai.useXpath().click("//a[contains(text(),'Advanced')]")
                                ai.click("//a[contains(text(),'(unsafe)')]").useCss()
                                ai.pause(3000);
                                ai.element('css selector', "#account-email-0", function (askForAccount) {
                                    if (askForAccount.status === -1) { // is not visible
                                        ai.element('css selector', "#submit_approve_access", function (visible) {
                                            if (visible.status === -1) { // is not visible
                                                handle = result.value[0];
                                                ai.switchWindow(handle);
                                                cb(false);
                                            }
                                            else {
                                                ai.click('#submit_approve_access');
                                                handle = result.value[0];
                                                ai.switchWindow(handle);
                                                ai.windowHandles(function (result) {
                                                    if (result.value.length == 1) {
                                                        cb(true);
                                                    }
                                                    else {
                                                        cb(false);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    else {
                                        ai.click('#account-email-0');
                                        handle = result.value[0];
                                        ai.switchWindow(handle);
                                        ai.windowHandles(function (result) {
                                            if (result.value.length == 1) {
                                                cb(true);
                                            }
                                            else {
                                                cb(false);
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            }
            else {
                ai.setValue('#identifierId', [fe, ai.Keys.ENTER]);
                ai.waitForElementVisible('#password', 20000);
                ai.setValue("input[name='password']", se);
                ai.click('#passwordNext');
                ai.pause(5000);
                ai.windowHandles(function (result) {
                    if (result.value.length == 1) {
                        handle = result.value[0];
                        ai.switchWindow(handle);
                        cb(true);
                    }
                    else {
                        ai.element('xpath', "//a[contains(text(),'Advanced')]", function (appIsNotVerified) {
                            if (appIsNotVerified.status === -1) {
                                ai.element('css selector', "#account-email-0", function (askForAccount) {
                                    if (askForAccount.status === -1) { // is not visible
                                        ai.element('css selector', "#submit_approve_access", function (visible) {
                                            if (visible.status === -1) { // is not visible
                                                handle = result.value[0];
                                                ai.switchWindow(handle);
                                                cb(false);
                                            }
                                            else {
                                                ai.click('#submit_approve_access');
                                                handle = result.value[0];
                                                ai.switchWindow(handle);
                                                ai.windowHandles(function (result) {
                                                    if (result.value.length == 1) {
                                                        cb(true);
                                                    }
                                                    else {
                                                        cb(false);
                                                    }
                                                })
                                            }
                                        });
                                    }
                                    else {
                                        ai.click('#account-email-0');
                                        handle = result.value[0];
                                        ai.switchWindow(handle);
                                        ai.windowHandles(function (result) {
                                            if (result.value.length == 1) {
                                                cb(true);
                                            }
                                            else {
                                                cb(false);
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                ai.useXpath().click("//a[contains(text(),'Advanced')]")
                                ai.click("//a[contains(text(),'(unsafe)')]").useCss()
                                ai.pause(3000);
                                ai.element('css selector', "#account-email-0", function (askForAccount) {
                                    if (askForAccount.status === -1) { // is not visible
                                        ai.element('css selector', "#submit_approve_access", function (visible) {
                                            if (visible.status === -1) { // is not visible
                                                handle = result.value[0];
                                                ai.switchWindow(handle);
                                                cb(false);
                                            }
                                            else {
                                                ai.click('#submit_approve_access');
                                                handle = result.value[0];
                                                ai.switchWindow(handle);
                                                ai.windowHandles(function (result) {
                                                    if (result.value.length == 1) {
                                                        cb(true);
                                                    }
                                                    else {
                                                        cb(false);
                                                    }
                                                })
                                            }
                                        });
                                    }
                                    else {
                                        ai.click('#account-email-0');
                                        handle = result.value[0];
                                        ai.switchWindow(handle);
                                        ai.windowHandles(function (result) {
                                            if (result.value.length == 1) {
                                                cb(true);
                                            }
                                            else {
                                                cb(false);
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            }
        })
    });
};