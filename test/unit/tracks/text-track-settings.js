module('Text Track Settings');

var tracks = [{
  kind: 'captions',
  label: 'test'
}];

test('should update settings', function() {
  var player = PlayerTest.makePlayer(tracks),
    newSettings = {
      'backgroundOpacity': '1',
      'textOpacity': '1',
      'windowOpacity': '1',
      'edgeStyle': 'raised',
      'fontFamily': 'monospaceSerif',
      'color': '#FFF',
      'backgroundColor': '#FFF',
      'windowColor': '#FFF',
      'fontPercent': 1.25
    };

  player.textTrackSettings.setValues(newSettings);

  deepEqual(player.textTrackSettings.getValues(), newSettings, 'values are updated');

  equal(player.el().querySelector('.vjs-fg-color > select').selectedIndex, 1, 'fg-color is set to default value');
  equal(player.el().querySelector('.vjs-bg-color > select').selectedIndex, 1, 'bg-color is set to default value');
  equal(player.el().querySelector('.window-color > select').selectedIndex, 1, 'window-color is set to default value');
  equal(player.el().querySelector('.vjs-text-opacity > select').selectedIndex, 1, 'text-opacity is set to default value');
  equal(player.el().querySelector('.vjs-bg-opacity > select').selectedIndex, 1, 'bg-opacity is set to default value');
  equal(player.el().querySelector('.vjs-window-opacity > select').selectedIndex, 1, 'window-opacity is set to default value');
  equal(player.el().querySelector('.vjs-edge-style select').selectedIndex, 1, 'edge-style is set to default value');
  equal(player.el().querySelector('.vjs-font-family select').selectedIndex, 1, 'font-family is set to default value');
  equal(player.el().querySelector('.vjs-font-percent select').selectedIndex, 3, 'font-percent is set to default value');
});

test('should restore default settings', function() {
  var player = PlayerTest.makePlayer(tracks);

  player.el().querySelector('.vjs-fg-color > select').selectedIndex = 1;
  player.el().querySelector('.vjs-bg-color > select').selectedIndex = 1;
  player.el().querySelector('.window-color > select').selectedIndex = 1;
  player.el().querySelector('.vjs-text-opacity > select').selectedIndex = 1;
  player.el().querySelector('.vjs-bg-opacity > select').selectedIndex = 1;
  player.el().querySelector('.vjs-window-opacity > select').selectedIndex = 1;
  player.el().querySelector('.vjs-edge-style select').selectedIndex = 1;
  player.el().querySelector('.vjs-font-family select').selectedIndex = 1;
  player.el().querySelector('.vjs-font-percent select').selectedIndex = 3;

  vjs.trigger(player.el().querySelector('.vjs-done-button'), 'click');
  vjs.trigger(player.el().querySelector('.vjs-default-button'), 'click');
  vjs.trigger(player.el().querySelector('.vjs-done-button'), 'click');

  deepEqual(player.textTrackSettings.getValues(), {
    'fontPercent': 1.00
  }, 'values are defaulted');

  equal(player.el().querySelector('.vjs-fg-color > select').selectedIndex, 0, 'fg-color is set to default value');
  equal(player.el().querySelector('.vjs-bg-color > select').selectedIndex, 0, 'bg-color is set to default value');
  equal(player.el().querySelector('.window-color > select').selectedIndex, 0, 'window-color is set to default value');
  equal(player.el().querySelector('.vjs-text-opacity > select').selectedIndex, 0, 'text-opacity is set to default value');
  equal(player.el().querySelector('.vjs-bg-opacity > select').selectedIndex, 0, 'bg-opacity is set to default value');
  equal(player.el().querySelector('.vjs-window-opacity > select').selectedIndex, 0, 'window-opacity is set to default value');
  equal(player.el().querySelector('.vjs-edge-style select').selectedIndex, 0, 'edge-style is set to default value');
  equal(player.el().querySelector('.vjs-font-family select').selectedIndex, 0, 'font-family is set to default value');
  equal(player.el().querySelector('.vjs-font-percent select').selectedIndex, 2, 'font-percent is set to default value');
});

test('should open on click', function() {
  var player = PlayerTest.makePlayer(tracks);
  vjs.trigger(player.el().querySelector('.vjs-texttrack-settings'), 'click');
  ok(!player.textTrackSettings.hasClass('vjs-hidden'), 'settings open');
});

test('should close on done click', function() {
  var player = PlayerTest.makePlayer(tracks);
  vjs.trigger(player.el().querySelector('.vjs-texttrack-settings'), 'click');
  vjs.trigger(player.el().querySelector('.vjs-done-button'), 'click');
  ok(player.textTrackSettings.hasClass('vjs-hidden'), 'settings closed');
});

test('if persist option is set, restore settings on init', function() {
  var player,
      oldRestoreSettings = vjs.TextTrackSettings.prototype.restoreSettings,
      restore = 0;

  vjs.TextTrackSettings.prototype.restoreSettings = function() {
    restore++;
  };

  player = PlayerTest.makePlayer({
    tracks: tracks,
    persistTextTrackSettings: true
  });

  equal(restore, 1, 'restore was called');

  vjs.TextTrackSettings.prototype.restoreSettings = oldRestoreSettings;
});

test('if persist option is set, save settings when "done"', function() {
  var player = PlayerTest.makePlayer({
        tracks: tracks,
        persistTextTrackSettings: true
      }),
      oldSaveSettings = vjs.TextTrackSettings.prototype.saveSettings,
      save = 0;

  vjs.TextTrackSettings.prototype.saveSettings = function() {
    save++;
  };

  vjs.trigger(player.el().querySelector('.vjs-done-button'), 'click');

  equal(save, 1, 'save was called');

  vjs.TextTrackSettings.prototype.saveSettings = oldSaveSettings;
});

test('do not try to restore or save settings if persist option is not set', function() {
  var player,
      oldRestoreSettings = vjs.TextTrackSettings.prototype.restoreSettings,
      oldSaveSettings = vjs.TextTrackSettings.prototype.saveSettings,
      save = 0,
      restore = 0;

  vjs.TextTrackSettings.prototype.restoreSettings = function() {
    restore++;
  };
  vjs.TextTrackSettings.prototype.saveSettings = function() {
    save++;
  };

  player = PlayerTest.makePlayer({
    tracks: tracks,
    persistTextTrackSettings: true
  });

  equal(restore, 1, 'restore was not called');

  vjs.trigger(player.el().querySelector('.vjs-done-button'), 'click');

  equal(save, 1, 'save was not called');

  vjs.TextTrackSettings.prototype.saveSettings = oldSaveSettings;
  vjs.TextTrackSettings.prototype.restoreSettings = oldRestoreSettings;
});
