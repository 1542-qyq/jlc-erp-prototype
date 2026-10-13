/* 消息通知管理（列表）页面脚本
 * 依赖：js/message-data.js（MsgData）、css/message.css
 */
(function () {
  'use strict';
  // 依赖 window.MsgData（js/message-data.js）
  var D = window.MsgData;
  if (!D) { console.error('MsgData 未加载'); }

  (function () {
    'use strict';
    var $ = function (sel) { return document.querySelector(sel); };
    var $$ = function (sel) { return document.querySelectorAll(sel); };

    /* ===== 生成 200 个用户池 ===== */
    function genUserPool(count) {
      var surnames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许'];
      var names = ['工', '明', '华', '伟', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '敏', '静', '丽', '辉', '鹏', '超', '秀英', '霞'];
      var users = [];
      var uidNum = 5970000;
      for (var i = 0; i < count; i++) {
        var sn = surnames[i % surnames.length];
        var nm = names[Math.floor(i / surnames.length) % names.length];
        var suffix = Math.floor(i / (surnames.length * names.length));
        users.push({
          uid: (uidNum + i) + 'A',
          userName: sn + nm + (suffix > 0 ? suffix : '')
        });
      }
      return users;
    }
    var USER_POOL = genUserPool(200);
    var UID_MAP = {};
    USER_POOL.forEach(function (u) { UID_MAP[u.uid] = u.userName; });

    function D.userNameOf(uid) { return UID_MAP[uid] || ('用户' + uid); }
    function D.validateUid(uid) { return !!UID_MAP[uid]; }

    /* ===== 生成 100 个批次（批次 + 接收记录 两层结构） ===== */
    function genMockBatches(count) {
      var types = ['system', 'audit', 'activity', 'coupon'];
      var typeSenders = { system: '系统管理员', audit: '张审核', activity: '李活动', coupon: '券券券' };
      var activities = ['星火计划2026', '0610缓存2.0', '助力2025全国电赛', 'EDA创新大赛', '开源峰会2026', '暑期训练营', ''];
      var contents = {
        system: [
          '尊敬的用户，平台将于本周六凌晨 02:00-06:00 进行系统升级维护，期间部分服务可能短暂不可用，敬请谅解。',
          '我们检测到您的账号在非常用地点登录，如非本人操作，请尽快修改密码。',
          '系统安全策略已更新，请您在下次登录时完成身份验证。',
          '平台将于本月底进行年度数据归档，届时部分历史查询功能可能延迟响应。',
          '您的账户密码将于 7 天后过期，请及时更新以避免影响使用。'
        ],
        audit: [
          '恭喜您，您的报名资料已经审核通过，请按时参加活动。',
          '您提交的项目审核未通过，原因是资料不完整，请补充后重新提交。',
          '您的项目正在审核中，请耐心等待，预计 1-3 个工作日内完成。',
          '您的项目被评为优秀项目，将获得额外奖励，请注意查收。',
          '复审通知：您的项目已进入第二轮评审，请保持电话畅通。'
        ],
        activity: [
          '活动报名即将截止，请尚未完成报名的用户尽快提交资料。',
          '活动将于明日正式开始，请已报名用户提前做好准备。',
          '新增活动场次：应广大用户要求，本活动加开一场，速来报名。',
          '活动日程更新：最新日程安排已发布，请及时查看。',
          '活动圆满结束，感谢所有参与者的支持，我们下次再见。'
        ],
        coupon: [
          '恭喜您获得200元优惠券，已发放至您的账户，请在有效期内使用。',
          '限时5折优惠券正在发放中，数量有限，先到先得，请及时领取。',
          '您有一张优惠券即将过期，请尽快使用，避免浪费。',
          '新用户专享：注册即送 100 元无门槛券，立即领取。',
          '会员日福利：全场券包低至 3 折，限时抢购。'
        ]
      };

      var batches = [];
      var baseTime = new Date('2026-10-09T12:00:00').getTime();
      var failReasons = ['用户不存在', '账号已注销', '客编格式错误', '用户拒收此类通知', '网络超时'];

      for (var b = 0; b < count; b++) {
        var type = types[b % types.length];
        var ci = b % contents[type].length;
        var content = contents[type][ci];
        var activity = activities[b % activities.length];
        var sender = typeSenders[type];
        var sendTime = new Date(baseTime - b * 3600 * 1000 * 1.5);

        // 每批次 5~50 个接收者
        var recCount = 5 + Math.floor(Math.random() * 46);
        var recipients = [];
        var poolIdx = [];
        for (var j = 0; j < recCount; j++) {
          var idx = (b * 7 + j * 3) % USER_POOL.length;
          if (poolIdx.indexOf(idx) >= 0) idx = (idx + 11) % USER_POOL.length;
          poolIdx.push(idx);
          var u = USER_POOL[idx];
          var rand = Math.random();
          var status;
          var failReason = '';
          if (rand < 0.75) {
            status = 'success';
          } else if (rand < 0.92) {
            status = 'fail';
            failReason = failReasons[Math.floor(Math.random() * failReasons.length)];
          } else if (rand < 0.96) {
            status = 'sending';
          } else {
            status = 'recalled';
          }
          recipients.push({
            id: 'r' + b + '-' + j,
            uid: u.uid,
            userName: u.userName,
            status: status,
            failReason: failReason
          });
        }

        batches.push({
          id: 'B' + (10000 + b),
          type: type,
          content: content,
          activity: activity,
          sender: sender,
          sendTime: D.formatDateTime(sendTime.toISOString()),
          recipients: recipients
        });
      }
      return batches;
    }

    var MOCK_DATA = genMockBatches(100);

    /* ===== State ===== */
    var state = {
      data: MOCK_DATA.slice(),
      filtered: MOCK_DATA.slice(),
      page: 1,
      pageSize: 10,
      selectedIds: [],
      // 撤回确认目标
      recallTarget: null // { type: 'batch', batchId }
    };

    /* ===== 工具函数 ===== */
    function typeLabel(t) { return (D.TYPE_MAP[t] || t); }
    function typeClass(t) {
      return '';
    }
      // 发送中（还有 sending）
      if (s.sending > 0) {
        return { label: '发送中', cls: 'status-sending' };
      }
      // 全部成功
      if (s.fail === 0 && s.sending === 0) {
        return { label: '发送成功', cls: 'status-sent' };
      }
      // 全部失败
      if (s.success === 0 && s.sending === 0) {
        return { label: '发送失败', cls: 'status-fail' };
      }
      // 部分成功部分失败 → 异常
      return { label: '发送异常', cls: 'status-warning' };
    }

    /* ===== 渲染列表 ===== */
    function renderTable() {
      var tbody = $('#tableBody');
      var start = (state.page - 1) * state.pageSize;
      var pageData = state.filtered.slice(start, start + state.pageSize);
      var html = '';
      pageData.forEach(function (row, idx) {
        var checked = state.selectedIds.indexOf(row.id) >= 0 ? 'checked' : '';
        var st = D.batchStatusLabel(row);
        var s = D.batchStats(row);
        var contentText = D.stripMd(row.content);
        if (contentText.length > 40) contentText = contentText.slice(0, 40) + '…';
        var canRecall = D.canBatchRecall(row);
        html += '<tr data-id="' + row.id + '">' +
          '<td class="cell-center"><input type="checkbox" class="row-check" data-id="' + row.id + '" ' + checked + '></td>' +
          '<td class="cell-center" style="color:var(--jlc-text-tertiary)">' + (start + idx + 1) + '</td>' +
          '<td class="ellipsis msg-content-link" data-id="' + row.id + '" title="' + D.escapeHtml(row.content.replace(/\n/g, ' ')) + '">' + D.escapeHtml(contentText) + '</td>' +
          '<td>' + typeLabel(row.type) + '</td>' +
          '<td class="cell-center">' + s.total + '</td>' +
          '<td class="ellipsis" title="' + D.escapeHtml(row.activity || '无') + '">' + D.escapeHtml(row.activity || '无') + '</td>' +
          '<td class="ellipsis" title="' + D.escapeHtml(row.sender) + '">' + D.escapeHtml(row.sender) + '</td>' +
          '<td>' + D.escapeHtml(row.sendTime) + '</td>' +
          '<td class="cell-center"><span class="' + st.cls + '">' + st.label + '</span></td>' +
          '<td class="cell-center">' +
            '<span class="link-btn" data-id="' + row.id + '" data-action="detail">查看详情</span>' +
            (canRecall ? '<span class="link-btn link-danger" data-id="' + row.id + '" data-action="recall">撤回批次</span>' : '') +
          '</td>' +
        '</tr>';
      });
      tbody.innerHTML = html;
      $('#emptyState').hidden = state.filtered.length > 0;
      $('#totalCount').textContent = state.filtered.length;
      renderPagination();
      updateSelectAll();
      updateSelectedCount();
    }

    function updateSelectAll() {
      var allCb = $('#checkAll');
      var checks = $$('#tableBody .row-check');
      if (checks.length === 0) { allCb.checked = false; allCb.indeterminate = false; return; }
      var checkedCount = 0;
      checks.forEach(function (cb) { if (cb.checked) checkedCount++; });
      allCb.checked = checkedCount === checks.length;
      allCb.indeterminate = checkedCount > 0 && checkedCount < checks.length;
    }

    function renderPagination() {
      var total = state.filtered.length;
      var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
      if (state.page > totalPages) state.page = totalPages;
      var container = $('#pageNumbers');
      var html = '';
      for (var i = 1; i <= totalPages; i++) {
        html += '<button class="page-num' + (i === state.page ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
      }
      container.innerHTML = html;
      $('#prevPage').disabled = state.page === 1;
      $('#nextPage').disabled = state.page === totalPages;
      $('#jumpInput').value = state.page;
    }

    function goPage(p) {
      var total = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
      p = Math.min(Math.max(1, p), total);
      state.page = p;
      renderTable();
    }

    function updateSelectedCount() {
      $('#selectedCount').textContent = '已选 ' + state.selectedIds.length + ' 项';
      var btn = $('#btnBatchRecall');
      if (btn) btn.hidden = state.selectedIds.length === 0;
    }

    /* ===== 筛选 ===== */
    function applyFilters() {
      var contentKw = $('#filterContent').value.trim().toLowerCase();
      var uidKw = $('#filterUid').value.trim().toLowerCase();
      var typeVal = $('#filterType').value;
      var activityVal = $('#filterActivity').value;
      var senderKw = $('#filterSender').value.trim().toLowerCase();
      var statusVal = $('#filterStatus').value;
      var ds = $('#filterDateStart').value.trim();
      var de = $('#filterDateEnd').value.trim();

      state.filtered = state.data.filter(function (batch) {
        if (contentKw && D.stripMd(batch.content).toLowerCase().indexOf(contentKw) === -1) return false;
        if (uidKw) {
          var found = batch.recipients.some(function (r) {
            return r.uid.toLowerCase().indexOf(uidKw) >= 0 || r.userName.toLowerCase().indexOf(uidKw) >= 0;
          });
          if (!found) return false;
        }
        if (typeVal && batch.type !== typeVal) return false;
        if (activityVal) {
          if (activityVal === 'none') {
            if (batch.activity) return false;
          } else if (batch.activity !== activityVal) {
            return false;
          }
        }
        if (senderKw && batch.sender.toLowerCase().indexOf(senderKw) === -1) return false;
        if (statusVal) {
          var st = D.batchStatusLabel(batch);
          // 匹配：statusVal 值与 label 对应
          var map = { success: '发送成功', fail: '发送失败', sending: '发送中', recalled: '已撤回', warning: '发送异常' };
          if (st.label !== map[statusVal]) return false;
        }
        if (ds && batch.sendTime < ds) return false;
        if (de && batch.sendTime > de + ' 23:59:59') return false;
        return true;
      });
      state.page = 1;
      renderTable();
    }

    /* ===== 详情抽屉 ===== */
    /* ===== 撤回 ===== */
    function openRecallConfirm(batchId) {
      var batch = state.data.find(function (b) { return b.id === batchId; });
      if (!batch) return;
      state.recallTarget = { type: 'batch', batchId: batchId };
      var contentText = D.stripMd(batch.content);
      if (contentText.length > 20) contentText = contentText.slice(0, 20) + '…';
      $('#nmRecallTitle').textContent = contentText;
      $('#nmRecallConfirmModal').hidden = false;
    }
    function doRecall() {
      if (!state.recallTarget) return;
      if (state.recallTarget.type === 'batch') {
        var batch = state.data.find(function (b) { return b.id === state.recallTarget.batchId; });
        if (batch) {
          batch.recipients.forEach(function (r) {
            if (r.status === 'success') r.status = 'recalled';
          });
        }
      }
      state.recallTarget = null;
      $('#nmRecallConfirmModal').hidden = true;
      applyFilters();
      D.saveBatches(state.data);
      showToast('撤回成功');
    });
        }
      }
      state.recallTarget = null;
      $('#nmRecallConfirmModal').hidden = true;
      applyFilters();
      if (state.currentBatchId) {
        // 如果详情抽屉开着，刷新
        var cur = state.data.find(function (b) { return b.id === state.currentBatchId; });
        if (cur) {
          var s = D.batchStats(cur);
          $('#ddStats').innerHTML =
            '<div class="stat-box"><div class="stat-num">' + s.total + '</div><div class="stat-label">总人数</div></div>' +
            '<div class="stat-box"><div class="stat-num" style="color:#52c41a">' + s.success + '</div><div class="stat-label">发送成功</div></div>' +
            '<div class="stat-box"><div class="stat-num" style="color:#ff4d4f">' + s.fail + '</div><div class="stat-label">发送失败</div></div>' +
            '<div class="stat-box"><div class="stat-num" style="color:#faad14">' + s.sending + '</div><div class="stat-label">发送中</div></div>' +
            '<div class="stat-box"><div class="stat-num" style="color:#8c8c8c">' + s.recalled + '</div><div class="stat-label">已撤回</div></div>';
          renderRecipients();
        }
      }
      showToast('撤回成功');
    }

    /* ===== 客编快速查询 ===== */
    function doUidQuickSearch() {
      var kw = $('#quickUidInput').value.trim().toLowerCase();
      if (!kw) { showToast('请输入客编'); return; }
      var found = null;
      for (var i = 0; i < state.data.length; i++) {
        var batch = state.data[i];
        for (var j = 0; j < batch.recipients.length; j++) {
          var r = batch.recipients[j];
          if (r.uid.toLowerCase().indexOf(kw) >= 0) {
            found = { batchId: batch.id, uid: r.uid };
            break;
          }
        }
        if (found) break;
      }
      if (!found) { showToast('未找到该客编的发送记录'); return; }
      // 跳转批次详情独立页，并预填搜索用户
      $('#filterUid').value = found.uid;
      applyFilters();
      location.href = 'message-batch-detail.html?batchId=' + found.batchId + '&uid=' + encodeURIComponent(found.uid);
    }

    /* ===== Toast ===== */
    var toastTimer = null;
    function showToast(msg, type) {
      var t = $('#nmToast');
      t.textContent = msg;
      t.className = 'toast ' + (type === 'error' ? 'toast-error' : 'toast-success');
      t.hidden = false;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { t.hidden = true; }, 2000);
    }

    /* ===== 通知效果展示 ===== */
    function showEffect(batch) {
      $('#nmEffectTag').textContent = typeLabel(batch.type);
      $('#nmEffectTag').className = 'msg-effect-tag';
      $('#nmEffectTime').textContent = batch.sendTime;
      $('#nmEffectContent').innerHTML = batch.content;
      $('#nmEffectMeta').textContent = '发件人：' + batch.sender + (batch.activity ? ' · 关联活动：' + batch.activity : '');
      $('#nmEffectModal').hidden = false;
    }

    /* ===== 导出记录 ===== */
      return s;
    }
    function exportBatches() {
      var list = state.filtered;
      if (list.length === 0) { showToast('没有可导出的记录', 'error'); return; }
      var headers = ['序号', '通知内容', '通知类型', '发送数量', '关联活动', '发送人', '发送时间', '发送状态'];
      var rows = [headers.join(',')];
      list.forEach(function (batch, idx) {
        var st = D.batchStatusLabel(batch);
        rows.push([
          idx + 1,
          D.csvEscape(D.stripMd(batch.content)),
          D.csvEscape(typeLabel(batch.type)),
          D.batchStats(batch).total,
          D.csvEscape(batch.activity || '无'),
          D.csvEscape(batch.sender),
          D.csvEscape(batch.sendTime),
          D.csvEscape(st.label)
        ].join(','));
      });
      var csv = '\ufeff' + rows.join('\n');
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '消息通知管理_' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('导出成功，共 ' + list.length + ' 条记录');
    }

    /* ===== 新建通知弹窗相关 ===== */
    var selectedUids = []; // [{ uid, userName }]

    function renderUidChips() {
      var container = $('#nmUserChips');
      if (selectedUids.length === 0) { container.innerHTML = ''; return; }
      var html = '';
      selectedUids.forEach(function (u) {
        html += '<span class="user-chip">' +
          '<span class="chip-name">' + D.escapeHtml(u.userName) + '</span>' +
          '<span class="chip-uid">' + D.escapeHtml(u.uid) + '</span>' +
          '<span class="chip-close" data-uid="' + D.escapeHtml(u.uid) + '">×</span>' +
        '</span>';
      });
      container.innerHTML = html;
    }

    function getSelectedType() {
      var radios = document.querySelectorAll('input[name="nmNotifyType"]');
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) return radios[i].value;
      }
      return '';
    }

    function validateSendForm() {
      var ok = true;
      if (!getSelectedType()) { $('#nmErrType').hidden = false; ok = false; } else { $('#nmErrType').hidden = true; }
      if (!$('#nmContentEditor').value.trim()) { $('#nmErrContent').hidden = false; ok = false; } else { $('#nmErrContent').hidden = true; }
      if (selectedUids.length === 0) { $('#nmErrUsers').hidden = false; ok = false; } else { $('#nmErrUsers').hidden = true; }
      return ok;
    }

    function simulateSendResult(uids) {
      // 模拟：90% 成功，10% 失败
      var success = [];
      var fail = [];
      var failReasons = ['用户不存在', '账号已注销', '客编格式错误', '用户拒收此类通知', '网络超时'];
      uids.forEach(function (u) {
        if (Math.random() < 0.9) {
          success.push(u);
        } else {
          fail.push({ uid: u.uid, reason: failReasons[Math.floor(Math.random() * failReasons.length)] });
        }
      });
      return { success: success, fail: fail };
    }

    var _lastFailList = [];
    function showSendResultAlert(succ, fail, failList) {
      var alert = $('#nmSendResultAlert');
      var textEl = $('#nmSendResultText');
      var exportBtn = $('#nmSendResultExportBtn');

      _lastFailList = (failList || []).map(function (u) {
        return { userName: u.userName || D.userNameOf(u.uid), uid: u.uid, reason: u.reason };
      });

      var html = '';
      if (succ > 0 && fail > 0) {
        html = '通知发送成功 <span class="rs-success-num">' + succ + '</span> 人，失败 <span class="rs-fail-num">' + fail + '</span> 人';
      } else if (succ > 0) {
        html = '通知已成功发送';
      } else {
        html = '通知发送失败';
      }
      textEl.innerHTML = html;

      alert.classList.remove('has-fail', 'all-fail');
      if (succ > 0 && fail > 0) alert.classList.add('has-fail');
      else if (succ === 0) alert.classList.add('all-fail');

      exportBtn.hidden = !(fail > 0 && _lastFailList.length);
      alert.hidden = false;
      clearTimeout(alert._t);
      alert._t = setTimeout(function () { alert.hidden = true; }, 4000);
      exportBtn.onclick = exportFailList;
    }
    function exportFailList() {
      if (!_lastFailList.length) return;
      var rows = ['接收用户,客编,失败原因'];
      _lastFailList.forEach(function (u) {
        rows.push(D.csvEscape(u.userName) + ',' + D.csvEscape(u.uid) + ',' + D.csvEscape(u.reason));
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

    function doSend() {
      if (!validateSendForm()) return;
      var modal = $('#newMsgModal');
      $('#nmModalOk').disabled = true;
      $('#nmModalOk').textContent = '发送中...';

      setTimeout(function () {
        $('#nmModalOk').disabled = false;
        $('#nmModalOk').textContent = '发送';
        var result = simulateSendResult(selectedUids);

        // 构建 recipients
        var recipients = [];
        var nowStr = D.formatDateTime(new Date().toISOString());
        result.success.forEach(function (u, i) {
          recipients.push({
            id: 'r-new-' + i,
            uid: u.uid,
            userName: u.userName,
            status: 'success',
            failReason: ''
          });
        });
        result.fail.forEach(function (f, i) {
          recipients.push({
            id: 'r-new-f' + i,
            uid: f.uid,
            userName: D.userNameOf(f.uid),
            status: 'fail',
            failReason: f.reason
          });
        });

        var content = $('#nmContentEditor').value.trim();
        var type = getSelectedType();
        var activity = $('#nmActivity').value === 'none' ? '' : $('#nmActivity').value.trim();
        var sender = '当前用户';

        var newBatch = {
          id: 'B' + Date.now(),
          type: type,
          content: content,
          activity: activity,
          sender: sender,
          sendTime: nowStr,
          recipients: recipients
        };

      state.data.unshift(newBatch);
        applyFilters();
        D.saveBatches(state.data);
        showSendResultAlert(result.success.length, result.fail.length, result.fail);
        modal.hidden = true;

        // 展示通知效果
        showEffect(newBatch);

        // 重置表单
        selectedUids = [];
        renderUidChips();
        $('#nmContentEditor').value = '';
        var radios = document.querySelectorAll('input[name="nmNotifyType"]');
        radios.forEach(function (r) { r.checked = false; });
      }, 1200);
    }

    function setupNewMsgModal() {
      // 打开
      $('#btnNewMsg').addEventListener('click', function () {
        $('#newMsgModalTitle').textContent = '新建通知';
        selectedUids = [];
        renderUidChips();
        $('#nmContentEditor').value = '';
        $('#nmActivity').value = 'none';
        var radios = document.querySelectorAll('input[name="nmNotifyType"]');
        radios.forEach(function (r) { r.checked = false; });
        $('#nmErrType').hidden = true;
        $('#nmErrContent').hidden = true;
        $('#nmErrUsers').hidden = true;
        $('#newMsgModal').hidden = false;
      });

      // 关闭
      $('#newMsgModalClose').addEventListener('click', function () { $('#newMsgModal').hidden = true; });
      $('#nmModalCancel').addEventListener('click', function () { $('#newMsgModal').hidden = true; });
      $('#newMsgModal').addEventListener('click', function (e) {
        if (e.target.id === 'newMsgModal') $('#newMsgModal').hidden = true;
      });

      // 发送
      $('#nmModalOk').addEventListener('click', doSend);

      // 客编输入
      $('#nmUidInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var val = this.value.trim();
          if (!val) return;
          if (!D.validateUid(val)) {
            $('#nmInvalidUidModal').hidden = false;
            return;
          }
          if (selectedUids.some(function (u) { return u.uid === val; })) {
            this.value = '';
            return;
          }
          selectedUids.push({ uid: val, userName: D.userNameOf(val) });
          renderUidChips();
          this.value = '';
          $('#nmErrUsers').hidden = true;
        }
      });

      // 删除 chip
      $('#nmUserChips').addEventListener('click', function (e) {
        if (e.target.classList.contains('chip-close')) {
          var uid = e.target.dataset.uid;
          selectedUids = selectedUids.filter(function (u) { return u.uid !== uid; });
          renderUidChips();
        }
      });

      // 无效客编弹窗
      $('#nmInvalidUidOk').addEventListener('click', function () { $('#nmInvalidUidModal').hidden = true; });

      // 插入链接
      $('#nmInsertLinkBtn').addEventListener('click', function () {
        $('#nmLinkTitle').value = '';
        $('#nmLinkUrl').value = '';
        $('#nmLinkCardModal').hidden = false;
      });
      $('#nmLinkCardCancel').addEventListener('click', function () { $('#nmLinkCardModal').hidden = true; });
      $('#nmLinkCardClose').addEventListener('click', function () { $('#nmLinkCardModal').hidden = true; });
      $('#nmLinkCardOk').addEventListener('click', function () {
        var title = $('#nmLinkTitle').value.trim();
        var url = $('#nmLinkUrl').value.trim();
        if (!title || !url) { showToast('请填写完整', 'error'); return; }
        var editor = $('#nmContentEditor');
        var md = '[' + title + '](' + url + ')';
        var start = editor.selectionStart;
        var end = editor.selectionEnd;
        var val = editor.value;
        editor.value = val.slice(0, start) + md + val.slice(end);
        editor.focus();
        editor.selectionStart = editor.selectionEnd = start + md.length;
        $('#nmLinkCardModal').hidden = true;
      });
    }

    /* ===== 侧边栏菜单 ===== */
    $('#menu').addEventListener('click', function (e) {
      var item = e.target.closest('.menu-item');
      if (!item) return;
      if (item.dataset.page) {
        location.href = item.dataset.page;
        return;
      }
      var level = item.dataset.level;
      var next = item.nextElementSibling;
      if ((level === '0' || level === '1' || level === '2')
          && next && next.classList.contains('menu-children')) {
        item.classList.toggle('parent-open');
        next.classList.toggle('open');
      }
    });

    /* ===== 侧边栏开合 ===== */
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

    /* ===== 事件绑定 ===== */
    // 导出记录
    $('#btnExport').addEventListener('click', exportBatches);

    // 筛选区收起/展开
    $('#toggleFilter').addEventListener('click', function () {
      var panel = $('#filterPanel');
      var collapsed = panel.classList.toggle('collapsed');
      this.querySelector('span').textContent = collapsed ? '展开' : '收起';
    });

    // 搜索/重置
    $('#btnSearch').addEventListener('click', applyFilters);
    $('#btnReset').addEventListener('click', function () {
      $('#filterContent').value = '';
      $('#filterUid').value = '';
      $('#filterType').value = '';
      $('#filterActivity').value = '';
      $('#filterSender').value = '';
      $('#filterStatus').value = '';
      $('#filterDateStart').value = '';
      $('#filterDateEnd').value = '';
      applyFilters();
    });

    // 客编快速查询
    $('#quickUidBtn').addEventListener('click', doUidQuickSearch);
    $('#quickUidInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doUidQuickSearch();
    });

    // 列表事件委托
    $('#tableBody').addEventListener('click', function (e) {
      var target = e.target;
      // 复选框
      if (target.classList.contains('row-check')) {
        var id = target.dataset.id;
        if (target.checked) {
          if (state.selectedIds.indexOf(id) < 0) state.selectedIds.push(id);
        } else {
          state.selectedIds = state.selectedIds.filter(function (x) { return x !== id; });
        }
        updateSelectAll();
        updateSelectedCount();
        return;
      }
      // 通知内容链接 → 详情（跳转独立页）
      if (target.classList.contains('msg-content-link')) {
        location.href = 'message-batch-detail.html?batchId=' + target.dataset.id;
        return;
      }
      var actionEl = target.closest('[data-action]');
      if (!actionEl) return;
      var action = actionEl.dataset.action;
      var id = actionEl.dataset.id;
      if (action === 'detail') {
        location.href = 'message-batch-detail.html?batchId=' + id;
      } else if (action === 'recall') {
        openRecallConfirm(id);
      }
    });

    // 全选
    $('#checkAll').addEventListener('change', function () {
      var checked = this.checked;
      var pageData = state.filtered.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
      pageData.forEach(function (row) {
        var idx = state.selectedIds.indexOf(row.id);
        if (checked && idx < 0) state.selectedIds.push(row.id);
        if (!checked && idx >= 0) state.selectedIds.splice(idx, 1);
      });
      renderTable();
    });

    // 分页
    $('#pageNumbers').addEventListener('click', function (e) {
      if (e.target.classList.contains('page-num')) {
        goPage(parseInt(e.target.dataset.page, 10));
      }
    });
    $('#prevPage').addEventListener('click', function () { goPage(state.page - 1); });
    $('#nextPage').addEventListener('click', function () { goPage(state.page + 1); });
    $('#jumpBtn').addEventListener('click', function () { goPage(parseInt($('#jumpInput').value, 10) || 1); });
    $('#jumpInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') goPage(parseInt(e.target.value, 10) || 1); });

    // 撤回确认弹窗
    $('#nmRecallCancel').addEventListener('click', function () {
      state.recallTarget = null;
      $('#nmRecallConfirmModal').hidden = true;
    });
    $('#nmRecallOk').addEventListener('click', doRecall);
    $('#nmRecallConfirmModal').addEventListener('click', function (e) {
      if (e.target.id === 'nmRecallConfirmModal') {
        state.recallTarget = null;
        this.hidden = true;
      }
    });

    // 通知效果弹窗
    $('#nmEffectClose').addEventListener('click', function () { $('#nmEffectModal').hidden = true; });
    $('#nmEffectOk').addEventListener('click', function () { $('#nmEffectModal').hidden = true; });
    $('#nmEffectModal').addEventListener('click', function (e) {
      if (e.target.id === 'nmEffectModal') this.hidden = true;
    });

    // 批量撤回（仅撤回含"发送成功"记录的批次）
    $('#btnBatchRecall').addEventListener('click', function () {
      if (state.selectedIds.length === 0) { showToast('请先选择批次', 'error'); return; }
      var recallable = state.selectedIds.filter(function (bid) {
        var batch = state.data.find(function (b) { return b.id === bid; });
        return batch && D.canBatchRecall(batch);
      });
      if (recallable.length === 0) { showToast('所选批次中没有可撤回的项（仅发送成功可撤回）', 'error'); return; }
      if (!confirm('确定撤回选中的 ' + recallable.length + ' 个批次吗？')) return;
      recallable.forEach(function (bid) {
        var batch = state.data.find(function (b) { return b.id === bid; });
        if (batch) {
          batch.recipients.forEach(function (r) {
            if (r.status === 'success') r.status = 'recalled';
          });
        }
      });
      state.selectedIds = [];
      applyFilters();
      D.saveBatches(state.data);
      showToast('已撤回 ' + recallable.length + ' 个批次');
    });

    // 初始化
    setupNewMsgModal();
    renderTable();
  })();


})();
