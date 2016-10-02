"use strict";

class Meta {
	constructor(page, per_page, page_count, total_count) {
		this.page = page;
		this.per_page = per_page;
		this.page_count = page_count;
		this.total_count = total_count;
	}
}

module.exports = Meta;