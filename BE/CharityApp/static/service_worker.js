/*
 * Copyright 2024 The Antibug
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const cacheName = "v2";

const cacheAssets = ["offline.html"];

self.addEventListener("install", (e) => {
	console.log("installed");

	e.waitUntil(
		caches
			.open(cacheName)
			.then((cache) => {
				console.log("caching");
				return cache.addAll(cacheAssets);
			})
			.then(() => self.skipWaiting()),
	);
	self.skipWaiting();
});

self.addEventListener("activate", (e) => {
	console.log("activated");

	e.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((thisCacheName) => {
					console.log(cacheNames);
					if (thisCacheName !== cacheName) {
						console.log("Deleting old cache:", thisCacheName);
						return caches.delete(thisCacheName);
					}
				}),
			);
		}),
	);

	// Đảm bảo các client hiện tại sử dụng SW mới nhất
	return self.clients.claim();
});

self.addEventListener("fetch", (e) => {
	console.log("fetching");
	console.log(e);
	e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

