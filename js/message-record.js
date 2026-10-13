
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
      var headers = ['序号', '接收用户', '客编', '通知内容', '通知类型', '关联活动', '发送人', '发送时间', '发送状态'];
      var rows = [headers.join(',')];
      list.forEach(function (row, idx) {
        rows.push([idx + 1, csvEscape(row.userName), csvEscape(row.uid), csvEscape(row.content),
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

    /* ===== 发送结果横幅 ===== */
    var _lastFailList = [];
    function showSendResultAlert(successCount, failCount, failList) {
      var alert = $('#nmSendResultAlert');
      var textEl = $('#nmSendResultText');
      var exportBtn = $('#nmSendResultExportBtn');

      _lastFailList = (failList || []).map(function (u) {
        return { userName: u.userName || userNameOf(u.uid), uid: u.uid, reason: u.reason };
      });

      var html = '';
      if (successCount > 0 && failCount > 0) {
        html = '通知发送成功 <span class="rs-success-num">' + successCount + '</span> 人，失败 <span class="rs-fail-num">' + failCount + '</span> 人';
      } else if (successCount > 0) {
        html = '通知已成功发送';
      } else {
        html = '通知发送失败';
      }
      textEl.innerHTML = html;

      alert.classList.remove('has-fail', 'all-fail');
      if (successCount > 0 && failCount > 0) alert.classList.add('has-fail');
      else if (successCount === 0) alert.classList.add('all-fail');

      exportBtn.hidden = !(failCount > 0 && _lastFailList.length);
      alert.hidden = false;
      clearTimeout(alert._t);
      alert._t = setTimeout(function () { alert.hidden = true; }, 4000);
      exportBtn.onclick = exportFailList;
    }
    function exportFailList() {
      if (!_lastFailList.length) return;
      var rows = ['接收用户,客编,失败原因'];
      _lastFailList.forEach(function (u) {
        rows.push(csvEscape(u.userName) + ',' + csvEscape(u.uid) + ',' + csvEscape(u.reason));
      });
      var csv = '\ufeff' + rows.join('\n');
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '发送失败名单_' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.csv';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('已导出 ' + _lastFailList.length + ' 条失败记录');
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
      var type = $('#filterType').value;
      var activity = $('#filterActivity').value;
      var sender = $('#filterSender').value.trim().toLowerCase();
      var status = $('#filterStatus').value;
      var start = parseDate($('#filterDateStart').value);
      var end = parseDate($('#filterDateEnd').value);

      state.filtered = state.allData.filter(function (row) {
        if (content && row.content.toLowerCase().indexOf(content) === -1) return false;
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
        var shortContent = row.content.length > 32 ? row.content.slice(0, 32) + '…' : row.content;
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
          '<td class="ellipsis msg-content-link" data-id="' + row.id + '" title="' + contentTitle + '" style="font-size:14px;">' + escapeHtml(shortContent) + '</td>' +
          '<td style="font-size:14px;">' + typeTxt + '</td>' +
          '<td class="ellipsis" title="' + activityTitle + '" style="font-size:14px;">' + escapeHtml(row.activity) + '</td>' +
          '<td class="ellipsis" title="' + escapeHtml(row.sender) + '" style="font-size:14px;">' + escapeHtml(row.sender) + '</td>' +
          '<td style="font-size:14px;">' + row.sendTime + '</td>' +
          '<td class="cell-center"><span class="' + statusCls + '" style="font-size:14px;">' + statusTxt + '</span></td>' +
          '<td class="cell-center" style="white-space:nowrap;">' +
            '<span class="link-btn" data-id="' + row.id + '" data-action="detail">查看详情</span>' +
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

    /* ===== 发送 ===== */
    var nmUids = [];
    function renderNmUserChips() {
      var html = '';
      nmUids.forEach(function (uid) {
        html += '<span class="user-chip">' + escapeHtml(uid) + '<button type="button" data-uid="' + uid + '" title="移除">×</button></span>';
      });
      $('#nmUserChips').innerHTML = html;
    }

    function setupNewMsgModal() {
      var btnNewMsg = $('#btnNewMsg');
      if (!btnNewMsg) return;

      $('#nmTypeSystem').checked = true;
      $('#nmActivity').value = 'none';
      $('#nmContentEditor').value = '';
      nmUids = [];
      renderNmUserChips();
      clearNmErrors();

      btnNewMsg.addEventListener('click', function () {
        $('#newMsgModal').hidden = false;
      });
      $('#newMsgModalClose').addEventListener('click', closeNewMsgModal);
      $('#nmModalCancel').addEventListener('click', closeNewMsgModal);
      $('#nmModalOk').addEventListener('click', doSend);

      $('#nmUidInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var val = e.target.value.trim();
          if (!val) return;
          var parts = val.split(/[\s,，]+/);
          parts.forEach(function (p) {
            p = p.trim();
            if (!p) return;
            if (nmUids.indexOf(p) === -1) nmUids.push(p);
          });
          renderNmUserChips();
          e.target.value = '';
        }
      });
      $('#nmUserChips').addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
          var uid = e.target.dataset.uid;
          nmUids = nmUids.filter(function (u) { return u !== uid; });
          renderNmUserChips();
        }
      });

      $('#nmInsertLinkBtn').addEventListener('click', function () {
        $('#nmLinkCardModal').hidden = false;
      });
      $('#nmLinkCardClose').addEventListener('click', closeLinkCard);
      $('#nmLinkCardCancel').addEventListener('click', closeLinkCard);
      $('#nmLinkCardOk').addEventListener('click', insertLink);

      $('#nmInvalidUidOk').addEventListener('click', function () { $('#nmInvalidUidModal').hidden = true; });
      $('#nmEffectClose').addEventListener('click', function () { $('#nmEffectModal').hidden = true; });
      $('#nmEffectOk').addEventListener('click', function () { $('#nmEffectModal').hidden = true; });
      $('#nmEffectModal').addEventListener('click', function (e) { if (e.target.id === 'nmEffectModal') this.hidden = true; });
      $('#nmDetailClose').addEventListener('click', closeDetail);
      $('#nmDetailOk').addEventListener('click', closeDetail);
      $('#nmRecallCancel').addEventListener('click', closeRecallConfirm);
      $('#nmRecallOk').addEventListener('click', doRecall);
    }

    function closeNewMsgModal() {
      $('#newMsgModal').hidden = true;
      clearNmErrors();
    }
    function clearNmErrors() {
      $('#nmErrType').hidden = true;
      $('#nmErrContent').hidden = true;
      $('#nmErrUsers').hidden = true;
    }
    function closeLinkCard() {
      $('#nmLinkCardModal').hidden = true;
      $('#nmLinkTitle').value = '';
      $('#nmLinkUrl').value = '';
      $('#nmErrLinkTitle').hidden = true;
      $('#nmErrLinkUrl').hidden = true;
    }
    function insertLink() {
      var title = $('#nmLinkTitle').value.trim();
      var url = $('#nmLinkUrl').value.trim();
      if (!title) {
        $('#nmErrLinkTitle').hidden = false; return;
      }
      if (!url || !/^https?:\/\//.test(url)) {
        $('#nmErrLinkUrl').hidden = false; return;
      }
      var editor = $('#nmContentEditor');
      var linkText = '[' + title + '](' + url + ')';
      var start = editor.selectionStart;
      var end = editor.selectionEnd;
      var val = editor.value;
      editor.value = val.slice(0, start) + linkText + val.slice(end);
      editor.focus();
      editor.selectionStart = editor.selectionEnd = start + linkText.length;
      closeLinkCard();
    }

    function doSend() {
      clearNmErrors();
      var typeEl = document.querySelector('input[name="nmNotifyType"]:checked');
      var type = typeEl ? typeEl.value : '';
      var activity = $('#nmActivity').value;
      var content = $('#nmContentEditor').value.trim();
      var validUids = [];
      var invalidUids = [];
      nmUids.forEach(function (uid) {
        if (validateUid(uid)) validUids.push(uid);
        else invalidUids.push(uid);
      });

      var hasError = false;
      if (!type) { $('#nmErrType').hidden = false; hasError = true; }
      if (!content) { $('#nmErrContent').hidden = false; hasError = true; }
      if (validUids.length === 0) { $('#nmErrUsers').hidden = false; hasError = true; }
      if (hasError) return;

      if (invalidUids.length > 0) {
        $('#nmInvalidCount').textContent = invalidUids.length;
        $('#nmInvalidUidList').innerHTML = invalidUids.map(function (u) { return '<span class="invalid-uid-item">' + escapeHtml(u) + '</span>'; }).join('');
        $('#nmInvalidUidModal').hidden = false;
        return;
      }

      var now = formatDateTime(new Date());
      var successCount = 0;
      var failList = [];
      validUids.forEach(function (uid) {
        var status = Math.random() < 0.85 ? 'success' : (Math.random() < 0.5 ? 'fail' : 'sending');
        var failReason = status === 'fail' ? FAIL_REASONS[Math.floor(Math.random() * FAIL_REASONS.length)] : '';
        if (status === 'fail') {
          failList.push({ userName: userNameOf(uid), uid: uid, reason: failReason });
        } else if (status === 'success') {
          successCount++;
        }
        state.allData.unshift({
          id: 'R' + (_idCounter++),
          uid: uid,
          userName: userNameOf(uid),
          content: content,
          type: type,
          activity: activity,
          sender: '当前管理员',
          sendTime: now,
          status: status,
          failReason: failReason
        });
      });

      closeNewMsgModal();
      applyFilters();
      $('#nmEffectTag').textContent = typeLabel(type);
      $('#nmEffectTag').className = 'msg-effect-tag';
      $('#nmEffectTime').textContent = now;
      $('#nmEffectContent').textContent = content;
      $('#nmEffectMeta').textContent = '发送给 ' + validUids.length + ' 位用户';
      $('#nmEffectModal').hidden = false;
      showSendResultAlert(successCount, failList.length, failList);
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
    // 导出记录
    $('#btnExport').addEventListener('click', exportRecords);

    // 筛选区收起/展开
    $('#toggleFilter').addEventListener('click', function () {
      var panel = $('#filterPanel');
      var collapsed = panel.classList.toggle('collapsed');
      this.querySelector('span').textContent = collapsed ? '展开' : '收起';
    });

    $('#btnSearch').addEventListener('click', applyFilters);
    $('#btnReset').addEventListener('click', function () {
      $('#filterContent').value = '';
      $('#filterType').value = '';
      $('#filterActivity').value = '';
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
        var uid = target.dataset.uid;
        if (navigator.clipboard) navigator.clipboard.writeText(uid);
        showToast('已复制 ' + uid);
        return;
      }
      var detailEl = target.closest('.msg-content-link');
      if (detailEl) { openDetail(detailEl.dataset.id); return; }
      if (target.dataset.action === 'detail') { openDetail(target.dataset.id); return; }
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

  /* ===== 初始化 ===== */
  setupNewMsgModal();
  initDatePicker();
  applyFilters();
})();
