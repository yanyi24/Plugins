JS 配置 ：
	<script>
	var floor = new Floor({
		positionEl: '.y-floor-content-position', // 给需要的内容版块加上这个class名
		floorBarPosition: 'ver-r', // floor标识在窗口中的位置，默认值"ver-r",可选值：'ver-l' 'ver-t' 'ver-b'
		title: ['1 F', '2 F', '3 F', '4 f'], // 如果html对应的内容只有三个，如demo，那么就将只创建前三个title
		positionPercent: 0, // 滑动距屏幕顶端10%时，切换
		animateDuring: 500, // 500ms
	});
	floor.init();
</script>
