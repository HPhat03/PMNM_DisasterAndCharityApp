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
import os
import json

from bs4 import NavigableString
from openai import OpenAI

from config import config

client = OpenAI(api_key=config["OPENAI_KEY"])

def create_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def read_file(path):
    with open(path, encoding="utf-8") as file:
        for line in file:
            yield line.rstrip("\n")

def init_output_dirs(output_dpath):
    urls_dpath = "/".join([output_dpath, "urls"])
    create_dir(urls_dpath)

    return urls_dpath

def get_text_from_tag(tag):
    if isinstance(tag, NavigableString):
        return tag
    # else if isinstance(tag, Tag):
    return tag.text


def extract_location_status(article):
    messages = [
        {
            "role": "system",
            "content": """Bạn là chuyên gia trong lĩnh vực trích xuất số liệu trong văn bản dài.

Nhiệm vụ của bạn là giúp người dùng trích xuất những số liệu trong bài báo, tin tức mà người dùng sẽ đưa vào.

Các bài báo có đề tài về thiên tai, đại dịch, bão, lũ,....
Bạn cần trích xuất các thông tin như tỉnh thành, bị ảnh hưởng bởi thiên tai hay dịch bệnh, sạt lở.

Dữ liệu bạn trả ra có định dạng là array object, ví dụ: [
    {
      "city": "Hà Nội",
      "status": "Đang bị ảnh hưởng bởi bão"
    }
]

Lưu ý:
  - Kết quả phản hồi không cần định dạng markdown để hiển thị, cần có dạng object json gồm city và status.
  - Dữ liệu phải được lấy trong nội dung người dùng đưa vào, không lấy từ bất kì nguồn nào khác.
  - Nếu trong tin tức không có số liệu nào, hãy phản hồi một mảng rỗng [].
  - Chỉ lấy tình trạng ảnh hưởng liên quan đến thiên tai, dịch bệnh, bão, lũ, sạt lở,.... Không cần những thời tiết bình thường như nắng, mưa,...
  - Với trường city, là 1 trong 63 tỉnh thành của Việt Nam.
  - Với trường status, chỉ cần nêu ảnh hưởng, thiệt hại chung, không cần chi tiết số liệu.
  - Nếu có nhiều hơn 1 tỉnh thành, hãy tách ra thành 1 array gồm nhiều object, mỗi object chỉ chứa 1 tỉnh thành duy nhất."""
        },
        {
            "role": "user",
            "content": article
        }
    ]
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )

    response = response.choices[0].message.content.strip()
    return json.load(response)
