from rest_framework.throttling import BaseThrottle, UserRateThrottle
from django.core.cache import cache
import time


class OncePerThirtyMinutesThrottle(BaseThrottle):
    def allow_request(self, request, view):
        # Sử dụng một key chung để lưu trạng thái throttle
        throttle_key = "article_crawl_throttle"
        last_called = cache.get(throttle_key)

        # Thời gian hiện tại
        current_time = time.time()

        # Nếu không có lịch sử hoặc đã quá 30 phút (1800 giây), cho phép gọi
        if not last_called or current_time - last_called > 1800:
            # Cập nhật lại thời gian gọi cuối cùng
            cache.set(throttle_key, current_time, timeout=1800)
            return True

        # Nếu không, từ chối yêu cầu
        return False

    def wait(self):
        """Trả về thời gian còn lại trước khi có thể gọi lại"""
        throttle_key = "article_crawl_throttle"
        last_called = cache.get(throttle_key)
        if last_called:
            remaining_time = 1800 - (time.time() - last_called)
            return max(remaining_time, 0)
        return None


class OncePerDayUserThrottle(UserRateThrottle):
    rate = '4/day'

