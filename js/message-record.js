
  (function () {
    'use strict';
    var $ = function (sel) { return document.querySelector(sel); };
    var $$ = function (sel) { return document.querySelectorAll(sel); };

    /* ===== 常量 ===== */
    var TYPE_MAP = {
      system: '系统通知', audit: '审核通知', activity: '活动通知', coupon: '优惠券通知'
    };
    var TYPE_CLASS = {
      system: 'msg-type-system', audit: 'msg-type-audit', activity: 'msg-type-activity', coupon: 'msg-type-coupon'
    };
    var ACTIVITY_OPTIONS = ['无', '星火计划2026', '电赛活动0301', '电商活动1201', '周年活动1215', '开源峰会2026', '暑期训练营', '0610缓存2.0', '助力2025全国电赛', 'EDA创新大赛'];
    var SENDERS = ['系统管理员', '张审核', '李活动', '券券券', '王运营'];
    var CONTENTS = [
      '尊敬的用户，平台将于本周六凌晨 02:00-06:00 进行系统升级维护，期间部分服务可能短暂不可用，敬请谅解。',
      '您提交的项目审核未通过，原因是资料不完整，请补充后重新提交。',
      '新增活动场次：应广大用户要求，本活动加开一场，速来报名。',
      '新用户专享：注册即送 100 元无门槛券，立即领取。',
      '您的账户密码将于 7 天后过期，请及时更新以避免影响使用。',
      '恭喜您，您的报名资料已经审核通过，请按时参加活动。',
      '活动将于明日正式开始，请已报名用户提前做好准备。',
      '您有一张优惠券即将过期，请尽快使用，避免浪费。',
      '平台将于本月底进行年度数据归档，届时部分历史查询功能可能延迟响应。',
      '复审通知：您的项目已进入第二轮评审，请保持电话畅通。',
      '您关注的项目有新的评论，点击查看详情。',
      '系统检测到您的账号在异地登录，请确认是否为本人操作。',
      '您参与的抽奖活动已开奖，恭喜获得三等奖。',
      '您的订单已发货，请注意查收。',
      '平台新版功能上线，邀您抢先体验。'
    ];
    var FAIL_REASONS = [
      '用户已注销', '客编不存在', '黑名单用户', '消息通道关闭', '设备离线'
    ];

    /* ===== 用户池 ===== */
    var UID_MAP = {};
    function genUserPool(n) {
      var pool = [];
      for (var i = 0; i < n; i++) {
        var num = String(5970000 + i).padStart(7, '0');
        var uid = i % 3 === 0 ? num + 'A' : num;
        var family = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨'];
        var names = ['工', '明', '华', '强', '磊', '静', '敏', '丽', '涛', '杰', '洋', '勇', '艳', '杰', '娟', '刚'];
        var name = family[i % family.length] + names[(i * 3) % names.length];
        UID_MAP[uid] = name;
        pool.push({ uid: uid, name: name });
      }
      return pool;
    }
    var USER_POOL = genUserPool(200);
    function userNameOf(uid) { return UID_MAP[uid] || '未知用户'; }
    function validateUid(uid) { return !!UID_MAP[uid]; }

    /* ===== 数据生成 ===== */
    var _idCounter = 10000;
    var _batchCounter = 1;
    function genBatchId() {
      var now = new Date();
      var pad = function (n) { return String(n).padStart(2, '0'); };
      var year = String(now.getFullYear()).slice(-2);
      var seq = String(_batchCounter++).padStart(3, '0');
      return 'B' + year + pad(now.getMonth() + 1) + pad(now.getDate()) + seq;
    }
    function genMockData(n) {
      var list = [];
      for (var i = 0; i < n; i++) {
        var user = USER_POOL[i % USER_POOL.length];
        var typeKeys = Object.keys(TYPE_MAP);
        var type = typeKeys[i % typeKeys.length];
        var r = Math.random();
        var status, failReason = '';
        if (r < 0.7) status = 'success';
        else if (r < 0.85) { status = 'fail'; failReason = FAIL_REASONS[i % FAIL_REASONS.length]; }
        else if (r < 0.95) status = 'sending';
        else status = 'recalled';

        list.push({
          id: 'R' + (_idCounter++),
          batchId: genBatchId(),
          uid: user.uid,
          userName: user.name,
          content: CONTENTS[i % CONTENTS.length],
          type: type,
          activity: ACTIVITY_OPTIONS[i % ACTIVITY_OPTIONS.length],
          sender: SENDERS[i % SENDERS.length],
          sendTime: randomSendTime(i),
          status: status,
          failReason: failReason
        });
      }
      return list;
    }

    function randomSendTime(offsetHours) {
      var now = new Date();
      var t = new Date(now.getTime() - offsetHours * 3600000 - Math.floor(Math.random() * 3600000));
      return formatDateTime(t);
    }
    function formatDateTime(d) {
      var pad = function (n) { return String(n).padStart(2, '0'); };
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
    function parseDate(s) {
      if (!s) return null;
      var d = new Date(s.replace(/-/g, '/'));
      return isNaN(d.getTime()) ? null : d;
    }

    function statusClass(s) {
      if (s === 'success') return 'status-sent';
      if (s === 'fail') return 'status-fail';
      if (s === 'sending') return 'status-sending';
      if (s === 'recalled') return 'status-recalled';
      return '';
    }
    function statusLabel(s) {
      if (s === 'success') return '发送成功';
      if (s === 'fail') return '发送失败';
      if (s === 'sending') return '发送中';
      if (s === 'recalled') return '已撤回';
      return s;
    }
    function typeLabel(t) { return TYPE_MAP[t] || t; }
    function typeClass(t) { return TYPE_CLASS[t] || ''; }

    function escapeHtml(s) {
      return String(s).replace(/[<>"'&]/g, function (c) {
        return { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' }[c];
      });
    }

    /* ===== 导出 ===== */
    function csvEscape(s) {
      s = String(s == null ? '' : s).replace(/\r?\n/g, ' ');
      if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0) {
        s = '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    }
    function exportRecords() {
      var list = state.filtered;
      if (list.length === 0) { showToast('没有可导出的记录', 'error'); return; }
      var headers = ['序号', '接收用户', '客编', '批次ID', '通知内容', '通知类型', '关联活动', '发送人', '发送时间', '发送状态'];
      var rows = [headers.join(',')];
      list.forEach(function (row, idx) {
        rows.push([idx + 1, csvEscape(row.userName), csvEscape(row.uid), csvEscape(row.batchId), csvEscape(row.content),
          csvEscape(typeLabel(row.type)), csvEscape(row.activity || '无'), csvEscape(row.sender),
          csvEscape(row.sendTime), csvEscape(statusLabel(row.status))].join(','));
      });
      var csv = '\ufeff' + rows.join('\n');
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '站内信发送记录_' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.csv';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('导出成功，共 ' + list.length + ' 条记录');
    }

    /* ===== 状态 ===== */
    var state = {
      allData: genMockData(100),
      filtered: [],
      page: 1,
      pageSize: 10,
      selectedIds: [],
      recallId: null
    };

    /* ===== 筛选 ===== */
    function applyFilters() {
      var content = $('#filterContent').value.trim().toLowerCase();
      var batchId = $('#filterBatchId').value.trim().toUpperCase();
      var uid = $('#filterUid').value.trim().toUpperCase();
      var type = $('#filterType').value;
      var activity = $('#filterActivity').value;
      var sender = $('#filterSender').value.trim().toLowerCase();
      var status = $('#filterStatus').value;
      var start = parseDate($('#filterDateStart').value);
      var end = parseDate($('#filterDateEnd').value);

      state.filtered = state.allData.filter(function (row) {
        if (content && row.content.toLowerCase().indexOf(content) === -1) return false;
        if (batchId && row.batchId.toUpperCase().indexOf(batchId) === -1) return false;
        if (uid && row.uid.toUpperCase().indexOf(uid) === -1) return false;
        if (type && row.type !== type) return false;
        if (activity && row.activity !== activity) return false;
        if (sender && row.sender.toLowerCase().indexOf(sender) === -1) return false;
        if (status && row.status !== status) return false;
        if (start) {
          var s = new Date(row.sendTime.replace(/-/g, '/'));
          if (s < start) return false;
        }
        if (end) {
          var e = new Date(row.sendTime.replace(/-/g, '/'));
          var endNext = new Date(end.getTime() + 86400000);
          if (e >= endNext) return false;
        }
        return true;
      });

      state.page = 1;
      state.selectedIds = [];
      updateSelectAll();
      renderTable();
      renderPagination();
    }

    /* ===== 渲染表格 ===== */
    function renderTable() {
      var start = (state.page - 1) * state.pageSize;
      var pageData = state.filtered.slice(start, start + state.pageSize);
      var html = '';

      pageData.forEach(function (row, idx) {
        var seq = start + idx + 1;
        var checked = state.selectedIds.indexOf(row.id) > -1 ? 'checked' : '';
        var statusCls = statusClass(row.status);
        var statusTxt = statusLabel(row.status);
        var typeCls = typeClass(row.type);
        var typeTxt = typeLabel(row.type);
        var activityTitle = escapeHtml(row.activity);
        var contentTitle = escapeHtml(row.content);
        var fullContent = row.content;
        var canRecall = row.status === 'success';

        html += '<tr data-id="' + row.id + '"' + (row.status === 'sending' ? ' class="row-sending"' : '') + '>' +
          '<td class="cell-center"><input type="checkbox" class="row-check" data-id="' + row.id + '" ' + checked + '></td>' +
          '<td class="cell-center" style="color:var(--jlc-text-tertiary)">' + seq + '</td>' +
          '<td class="cell-center">' +
            '<div class="msg-user-info" title="' + escapeHtml(row.userName + ' ' + row.uid) + '" style="align-items:center;justify-content:center;">' +
              '<span class="msg-user-name" style="font-size:14px;">' + escapeHtml(row.userName) + '</span>' +
              '<span class="msg-user-id link-btn" data-action="copy-uid" data-uid="' + row.uid + '" title="点击复制客编" style="font-size:14px;color:#1677ff;cursor:pointer;">' + escapeHtml(row.uid) + '</span>' +
            '</div>' +
          '</td>' +
          '<td class="cell-center batch-id-cell">' + escapeHtml(row.batchId) + '</td>' +
          '<td class="msg-content-cell msg-content-link" data-id="' + row.id + '" title="' + contentTitle + '" style="font-size:14px;">' + escapeHtml(fullContent) + '</td>' +
          '<td style="font-size:14px;">' + typeTxt + '</td>' +
          '<td class="ellipsis" title="' + activityTitle + '" style="font-size:14px;">' + escapeHtml(row.activity) + '</td>' +
          '<td class="ellipsis" title="' + escapeHtml(row.sender) + '" style="font-size:14px;">' + escapeHtml(row.sender) + '</td>' +
          '<td style="font-size:14px;">' + row.sendTime + '</td>' +
          '<td class="cell-center"><span class="' + statusCls + '" style="font-size:14px;">' + statusTxt + '</span></td>' +
          '<td class="cell-center" style="white-space:nowrap;">' +
            (canRecall ? '<span class="link-btn link-danger" data-id="' + row.id + '" data-action="recall">撤回</span>' : '') +
          '</td>' +
          '</tr>';
      });

      $('#tableBody').innerHTML = html;
      $('#totalCount').textContent = state.filtered.length;
      $('#emptyState').hidden = state.filtered.length > 0;
      $('#dataTable').hidden = state.filtered.length === 0;
      $('#pagination').hidden = state.filtered.length === 0;
      updateSelectAll();
      updateSelectedCount();
    }

    /* ===== 分页 ===== */
    function renderPagination() {
      var total = state.filtered.length;
      var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
      if (state.page > totalPages) state.page = totalPages;
      if (state.page < 1) state.page = 1;

      var numbers = '';
      for (var i = 1; i <= totalPages; i++) {
        numbers += '<button class="page-num ' + (i === state.page ? 'active' : '') + '" data-page="' + i + '" title="第' + i + '页">' + i + '</button>';
      }
      $('#pageNumbers').innerHTML = numbers;
      $('#prevPage').disabled = state.page === 1;
      $('#nextPage').disabled = state.page === totalPages;
      $('#jumpInput').value = state.page;
    }

    function goPage(p) {
      var total = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
      if (p < 1) p = 1;
      if (p > total) p = total;
      state.page = p;
      renderTable();
      renderPagination();
    }

    /* ===== 详情弹窗 ===== */
    function openDetail(id) {
      var row = state.allData.find(function (r) { return r.id === id; });
      if (!row) return;
      $('#ndBatchId').textContent = row.batchId;
      $('#ndUser').textContent = row.userName;
      $('#ndUid').textContent = row.uid;
      $('#ndType').textContent = typeLabel(row.type);
      $('#ndActivity').textContent = row.activity;
      $('#ndSender').textContent = row.sender;
      $('#ndTime').textContent = row.sendTime;
      $('#ndStatus').innerHTML = '<span class="' + statusClass(row.status) + '" style="font-size:14px;">' + statusLabel(row.status) + '</span>';
      $('#ndContent').textContent = row.content;
      if (row.status === 'fail' && row.failReason) {
        $('#ndFailWrap').hidden = false;
        $('#ndFailReason').textContent = row.failReason;
      } else {
        $('#ndFailWrap').hidden = true;
      }
      $('#nmDetailModal').hidden = false;
    }
    function closeDetail() { $('#nmDetailModal').hidden = true; }

    /* ===== 撤回 ===== */
    function openRecallConfirm(id) {
      var row = state.allData.find(function (r) { return r.id === id; });
      if (!row) return;
      state.recallId = id;
      $('#nmRecallTitle').textContent = row.content.length > 20 ? row.content.slice(0, 20) + '…' : row.content;
      $('#nmRecallConfirmModal').hidden = false;
    }
    function closeRecallConfirm() {
      state.recallId = null;
      $('#nmRecallConfirmModal').hidden = true;
    }
    function doRecall() {
      if (!state.recallId) return;
      var row = state.allData.find(function (r) { return r.id === state.recallId; });
      if (row && row.status === 'success') {
        row.status = 'recalled';
        showToast('撤回成功');
      } else if (row) {
        showToast('该状态不支持撤回', 'error');
      }
      closeRecallConfirm();
      applyFilters();
    }

    /* ===== 选择 ===== */
    function updateSelectAll() {
      var allCb = $('#checkAll');
      var checks = $$('#tableBody .row-check');
      if (checks.length === 0) { allCb.checked = false; allCb.indeterminate = false; return; }
      var checkedCount = 0;
      checks.forEach(function (cb) { if (cb.checked) checkedCount++; });
      allCb.checked = checkedCount === checks.length;
      allCb.indeterminate = checkedCount > 0 && checkedCount < checks.length;
    }
    function updateSelectedCount() {
      $('#selectedCount').textContent = '已选 ' + state.selectedIds.length + ' 项';
      var btn = $('#btnBatchRecall');
      if (btn) btn.hidden = state.selectedIds.length === 0;
    }

    /* ===== Toast ===== */
    function showToast(msg, type) {
      var toast = $('#nmToast');
      toast.textContent = msg;
      toast.className = 'toast ' + (type === 'error' ? 'toast-error' : 'toast-success');
      toast.hidden = false;
      setTimeout(function () { toast.hidden = true; }, 2500);
    }

    /* ===== 事件绑定 ===== */
    // 详情弹窗
    $('#nmDetailClose').addEventListener('click', closeDetail);
    $('#nmDetailOk').addEventListener('click', closeDetail);

    // 撤回确认弹窗
    $('#nmRecallCancel').addEventListener('click', closeRecallConfirm);
    $('#nmRecallOk').addEventListener('click', doRecall);

    // 导出记录
    $('#btnExport').addEventListener('click', exportRecords);

    $('#btnSearch').addEventListener('click', applyFilters);
    $('#btnReset').addEventListener('click', function () {
      $('#filterContent').value = '';
      $('#filterBatchId').value = '';
      $('#filterUid').value = '';
      $('#filterType').value = '';
      $('#filterActivity').value = '';
      $('#filterActivityText').value = '';
      $('#filterSender').value = '';
      $('#filterStatus').value = '';
      $('#filterDateStart').value = '';
      $('#filterDateEnd').value = '';
      applyFilters();
    });

    $('#checkAll').addEventListener('change', function (e) {
      var checks = $$('#tableBody .row-check');
      checks.forEach(function (cb) { cb.checked = e.target.checked; });
      var pageIds = Array.from(checks).map(function (cb) { return cb.dataset.id; });
      if (e.target.checked) {
        pageIds.forEach(function (id) { if (state.selectedIds.indexOf(id) === -1) state.selectedIds.push(id); });
      } else {
        state.selectedIds = state.selectedIds.filter(function (id) { return pageIds.indexOf(id) === -1; });
      }
      updateSelectedCount();
    });

    $('#tableBody').addEventListener('click', function (e) {
      var target = e.target;
      if (target.classList.contains('row-check')) {
        var id = target.dataset.id;
        if (target.checked) {
          if (state.selectedIds.indexOf(id) === -1) state.selectedIds.push(id);
        } else {
          state.selectedIds = state.selectedIds.filter(function (sid) { return sid !== id; });
        }
        updateSelectAll();
        updateSelectedCount();
        return;
      }
      if (target.dataset.action === 'copy-uid') {
        var selection = window.getSelection ? window.getSelection().toString() : '';
        if (selection) return;
        var uid = target.dataset.uid;
        if (navigator.clipboard) navigator.clipboard.writeText(uid);
        showToast('已复制 ' + uid);
        return;
      }
      if (target.dataset.action === 'recall') { openRecallConfirm(target.dataset.id); return; }
    });

    $('#pageNumbers').addEventListener('click', function (e) {
      if (e.target.classList.contains('page-num')) goPage(parseInt(e.target.dataset.page, 10));
    });
    $('#prevPage').addEventListener('click', function () { goPage(state.page - 1); });
    $('#nextPage').addEventListener('click', function () { goPage(state.page + 1); });
    $('#jumpBtn').addEventListener('click', function () { goPage(parseInt($('#jumpInput').value, 10) || 1); });
    $('#jumpInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') goPage(parseInt(e.target.value, 10) || 1); });

    $('#btnBatchRecall').addEventListener('click', function () {
      if (state.selectedIds.length === 0) { showToast('请先选择记录', 'error'); return; }
      var recallable = state.selectedIds.filter(function (id) {
        var row = state.allData.find(function (r) { return r.id === id; });
        return row && row.status === 'success';
      });
      if (recallable.length === 0) { showToast('所选记录中没有可撤回的项（仅发送成功可撤回）', 'error'); return; }
      if (!confirm('确定撤回选中的 ' + recallable.length + ' 条记录吗？')) return;
      recallable.forEach(function (id) {
        var row = state.allData.find(function (r) { return r.id === id; });
        if (row) row.status = 'recalled';
      });
      state.selectedIds = [];
      applyFilters();
      showToast('已撤回 ' + recallable.length + ' 条记录');
    });

    // 菜单点击跳转
    $$('.menu-item[data-page]').forEach(function (item) {
      item.addEventListener('click', function () {
        var page = item.dataset.page;
        if (page) window.location.href = page;
      });
    });

    // 侧边栏开合
    $('#toggleSidebar').addEventListener('click', function () {
      var sidebar = $('#sidebar');
      var overlay = $('#sidebarOverlay');
      var shouldOpen = !sidebar.classList.contains('show');
      sidebar.classList.toggle('show', shouldOpen);
      overlay.classList.toggle('show', shouldOpen);
    });
    $('#sidebarOverlay').addEventListener('click', function () {
      $('#sidebar').classList.remove('show');
      this.classList.remove('show');
    });

    /* ===== 日期选择器 ===== */
  function initDatePicker() {
    if (typeof laydate === 'undefined') return;
    laydate.render({
      elem: '#filterDateStart',
      range: ['#filterDateStart', '#filterDateEnd'],
      format: 'yyyy-MM-dd',
      btns: [],
      theme: '#1890ff',
      trigger: 'click'
    });

    var clearBtn = $('#dateClearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        $('#filterDateStart').value = '';
        $('#filterDateEnd').value = '';
        applyFilters();
      });
    }
  }


      /* ===== 可搜索下拉框（关联活动） ===== */
      var ACTIVITY_PAGE_OPTIONS = [
        { value: 'none', label: '无' },
        { value: '星火计划2026', label: '星火计划2026' },
        { value: '0610缓存2.0', label: '0610缓存2.0' },
        { value: '助力2025全国电赛', label: '助力2025全国电赛' },
        { value: 'EDA创新大赛', label: 'EDA创新大赛' },
        { value: '开源峰会2026', label: '开源峰会2026' },
        { value: '暑期训练营', label: '暑期训练营' }
      ];

      function initSearchableSelect(wrapId, options, onChange) {
        var wrap = document.getElementById(wrapId);
        if (!wrap) return;
        var textInput = wrap.querySelector('.search-select-input');
        var hiddenInput = wrap.querySelector('input[type="hidden"]');
        var dropdown = wrap.querySelector('.search-select-dropdown');
        var optionsBox = wrap.querySelector('.search-select-options');
        var selectedValue = '';
        var selectedLabel = '';

        function renderOptions(list) {
          optionsBox.innerHTML = '';
          if (!list.length) {
            var empty = document.createElement('div');
            empty.className = 'search-select-option empty';
            empty.textContent = '无匹配活动';
            optionsBox.appendChild(empty);
            return;
          }
          list.forEach(function (opt) {
            var div = document.createElement('div');
            div.className = 'search-select-option';
            div.setAttribute('data-value', opt.value);
            div.textContent = opt.label;
            div.addEventListener('mousedown', function (e) {
              e.preventDefault();
              selectedValue = opt.value;
              selectedLabel = opt.label;
              hiddenInput.value = opt.value;
              textInput.value = opt.label;
              closeDropdown();
              if (typeof onChange === 'function') onChange(opt.value);
            });
            optionsBox.appendChild(div);
          });
        }

        function openDropdown() {
          dropdown.classList.remove('hidden');
          wrap.classList.add('open');
        }

        function closeDropdown() {
          dropdown.classList.add('hidden');
          wrap.classList.remove('open');
        }

        function filterOptions(kw) {
          var lower = kw.trim().toLowerCase();
          var filtered = options.filter(function (opt) {
            return opt.label.toLowerCase().indexOf(lower) !== -1;
          });
          renderOptions(filtered);
        }

        textInput.addEventListener('focus', function () {
          openDropdown();
          filterOptions(textInput.value);
        });

        textInput.addEventListener('input', function () {
          openDropdown();
          filterOptions(this.value);
        });

        textInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            var visible = optionsBox.querySelectorAll('.search-select-option:not(.empty)');
            if (visible.length === 1) {
              visible[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            }
          } else if (e.key === 'Escape') {
            closeDropdown();
          }
        });

        textInput.addEventListener('blur', function () {
          setTimeout(function () {
            if (!wrap.contains(document.activeElement)) {
              if (textInput.value !== selectedLabel) {
                textInput.value = selectedLabel;
              }
              closeDropdown();
            }
          }, 150);
        });

        document.addEventListener('click', function (e) {
          if (!wrap.contains(e.target)) closeDropdown();
        });

        hiddenInput.value = selectedValue;
      }

  initSearchableSelect('filterActivityWrap', ACTIVITY_PAGE_OPTIONS, applyFilters);

  /* ===== 初始化 ===== */
  initDatePicker();
  applyFilters();
})();
