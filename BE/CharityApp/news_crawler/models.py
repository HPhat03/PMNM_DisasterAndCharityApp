# Copyright 2024 The Antibug
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
class CrawlArticle:
    def __init__(self, title: str, description, paragraphs, src: str, img: str, date):
        self.title = title
        self.description = description
        self.paragraphs = paragraphs
        self.src = src
        self.img = img
        self.date = date

    def __str__(self):
        _str = self.src + "\n\n"
        _str += (self.img or "https://assets.appsmith.com/widgets/default.png") + "\n\n"
        _str += self.title + "\n\n"

        for p in self.description:
            _str += p + "\n"
        _str += "\n"

        for p in self.paragraphs:
            _str += p + "\n"

        return _str
