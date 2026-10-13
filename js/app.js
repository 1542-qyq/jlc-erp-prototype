/* ============================================================
   嘉立创集团 - 参赛报名审核
   交互逻辑：数据渲染 / 筛选 / 分页 / 模态框 / 响应式
   ============================================================ */

(function () {
  'use strict';

  /* ===== Mock Data ===== */
  var MOCK_DATA = [
    { id: 1, userName: '', userId: '5974001A', phone: '138****8001', email: 'user1@jlc.com', event: '星火计划2026', time: '2026-09-15 14:05:53', joinType: '个人', member: 'eda_trq', project: '[星火计划2026] 0', projectStatus: 'published', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 2, userName: '涂mega测试', userId: '5974002A', phone: '138****8002', email: 'tutest@jlc.com', event: '0610缓存2.0', time: '2026-09-15 14:02:21', joinType: '个人', member: 'eda_trq', project: '0915测试', projectStatus: 'unpublished', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 3, userName: '张大号', userId: '5960300A', phone: '139****3001', email: 'zhangdh@jlc.com', event: '星火计划2026', time: '2026-09-01 14:35:59', joinType: '个人', member: '', project: '', projectStatus: 'none', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 4, userName: '王小明', userId: '5960301A', phone: '139****3002', email: 'wangxm@jlc.com', event: '星火计划2026', time: '2026-09-01 14:35:35', joinType: '个人', member: '', project: '', projectStatus: 'none', projectAttr: '公开', remark: '首次报名', report: '', sort: 1, hasSupplement: false },
    { id: 5, userName: 'testaaaa', userId: '5970000A', phone: '137****1200', email: 'testaaaa@jlc.com', event: '0610缓存2.0', time: '2026-09-01 13:51:25', joinType: '团队', member: 'eda_mq', project: 'testtestest', projectStatus: 'unpublished', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 6, userName: 'lc', userId: '479676A', phone: '136****7600', email: 'lc@jlc.com', event: '助力2025全国电赛', time: '2026-08-17 16:26:21', joinType: '团队', member: 'eda_zuh', project: '[2025电赛活动] a', projectStatus: 'unpublished', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: true },
    { id: 7, userName: '', userId: '5960319A', phone: '135****3190', email: 'zhangsic@jlc.com', event: '星火计划2026', time: '2026-08-13 15:05:57', joinType: '个人', member: 'zhangsic', project: '[星火计划2026] 张', projectStatus: 'unpublished', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 8, userName: '李白', userId: '5960320A', phone: '135****3200', email: 'libai@jlc.com', event: '星火计划2026', time: '2026-08-13 14:46:12', joinType: '个人', member: 'libai', project: '[星火计划2026] 蓝', projectStatus: 'unpublished', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 9, userName: '深圳文工程测试', userId: '5960608A', phone: '134****6080', email: 'szwen@jlc.com', event: '0610缓存2.0', time: '2026-08-13 10:11:41', joinType: '个人', member: 'zxr001', project: '测试工程2432', projectStatus: 'unpublished', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 10, userName: '李工', userId: '5970001A', phone: '138****0001', email: 'ligong@jlc.com', event: '星火计划2026', time: '2026-08-10 09:30:00', joinType: '团队', member: 'li_team', project: '[星火计划2026] 创新设计', projectStatus: 'published', projectAttr: '公开', remark: '重点关注', report: '已提交', sort: 2, hasSupplement: false },
    { id: 11, userName: '王设计', userId: '5970002A', phone: '138****0002', email: 'wang@jlc.com', event: '助力2025全国电赛', time: '2026-08-08 16:20:30', joinType: '个人', member: '', project: '高速PCB设计', projectStatus: 'published', projectAttr: '私有', remark: '', report: '已提交', sort: 3, hasSupplement: false },
    { id: 12, userName: '陈工', userId: '5970003A', phone: '138****0003', email: 'chen@jlc.com', event: '0610缓存2.0', time: '2026-08-05 11:15:00', joinType: '团队', member: 'chen_group', project: '缓存控制器设计', projectStatus: 'unpublished', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 13, userName: '刘工', userId: '5970004A', phone: '138****0004', email: 'liu@jlc.com', event: '星火计划2026', time: '2026-08-03 10:00:00', joinType: '个人', member: '', project: '', projectStatus: 'none', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: true },
    { id: 14, userName: '赵工程师', userId: '5970005A', phone: '138****0005', email: 'zhao@jlc.com', event: '助力2025全国电赛', time: '2026-08-01 14:45:20', joinType: '团队', member: 'zhao_team', project: '[2025电赛活动] 智能小车', projectStatus: 'published', projectAttr: '公开', remark: '参赛队伍', report: '已提交', sort: 2, hasSupplement: false },
    { id: 15, userName: '孙同学', userId: '5970006A', phone: '138****0006', email: 'sun@jlc.com', event: '星火计划2026', time: '2026-07-28 09:12:34', joinType: '个人', member: '', project: '[星火计划2026] 入门项目', projectStatus: 'unpublished', projectAttr: '私有', remark: '学生参赛', report: '', sort: 1, hasSupplement: false },
    { id: 16, userName: '周教授', userId: '5970007A', phone: '138****0007', email: 'zhou@jlc.com', event: '0610缓存2.0', time: '2026-07-25 15:30:00', joinType: '团队', member: 'zhou_lab', project: '低功耗缓存架构', projectStatus: 'published', projectAttr: '公开', remark: '高校合作', report: '已提交', sort: 1, hasSupplement: false },
    { id: 17, userName: '吴工', userId: '5970008A', phone: '138****0008', email: 'wu@jlc.com', event: '星火计划2026', time: '2026-07-22 13:45:00', joinType: '个人', member: 'wu_engineer', project: '[星火计划2026] 多功能板', projectStatus: 'unpublished', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 18, userName: '郑开发', userId: '5970009A', phone: '138****0009', email: 'zheng@jlc.com', event: '助力2025全国电赛', time: '2026-07-20 10:20:15', joinType: '团队', member: 'zheng_dev', project: '[2025电赛活动] 信号源', projectStatus: 'published', projectAttr: '公开', remark: '', report: '已提交', sort: 3, hasSupplement: false },
    { id: 19, userName: '', userId: '5970010A', phone: '138****0010', email: 'user10@jlc.com', event: '0610缓存2.0', time: '2026-07-18 16:00:00', joinType: '个人', member: '', project: '', projectStatus: 'none', projectAttr: '公开', remark: '', report: '', sort: 1, hasSupplement: false },
    { id: 20, userName: '黄老师', userId: '5970011A', phone: '138****0011', email: 'huang@jlc.com', event: '星火计划2026', time: '2026-07-15 11:30:00', joinType: '团队', member: 'huang_class', project: '[星火计划2026] 教学项目集', projectStatus: 'published', projectAttr: '公开', remark: '教学团队', report: '已提交', sort: 2, hasSupplement: false },
    { id: 21, userName: '林工', userId: '5970012A', phone: '138****0012', email: 'lin@jlc.com', event: '助力2025全国电赛', time: '2026-07-12 08:45:00', joinType: '个人', member: '', project: '信号采集系统', projectStatus: 'unpublished', projectAttr: '私有', remark: '', report: '', sort: 1, hasSupplement: true },
    { id: 22, userName: '何工程师', userId: '5970013A', phone: '138****0013', email: 'he@jlc.com', event: '星火计划2026', time: '2026-07-10 14:20:00', joinType: '团队', member: 'he_team', project: '[星火计划2026] 物联网网关', projectStatus: 'published', projectAttr: '公开', remark: '', report: '已提交', sort: 1, hasSupplement: false },
    { id: 23, userName: '高工', userId: '5970014A', phone: '138****0014', email: 'gao@jlc.com', event: '0610缓存2.0', time: '2026-07-08 09:50:00', joinType: '个人', member: 'gao_dev', project: '高速缓存设计', projectStatus: 'published', projectAttr: '公开', remark: '资深工程师', report: '已提交', sort: 5, hasSupplement: false },
    { id: 24, userName: '罗同学', userId: '5970015A', phone: '138****0015', email: 'luo@jlc.com', event: '助力2025全国电赛', time: '2026-07-05 17:30:00', joinType: '团队', member: 'luo_group', project: '[2025电赛活动] 电源管理', projectStatus: 'unpublished', projectAttr: '公开', remark: '大学生组', report: '', sort: 1, hasSupplement: false },
  ];

  var MOCK_USERS = [
    { name: '涂mega测试', username: 'eda_trq', uid: '5974002A' },
    { name: '张大号', username: 'zhangdh', uid: '5960300A' },
    { name: '王小明', username: 'wangxm', uid: '5960301A' },
    { name: 'testaaaa', username: 'eda_mq', uid: '5970000A' },
    { name: 'lc', username: 'eda_zuh', uid: '479676A' },
    { name: '深圳文工程测试', username: 'zxr001', uid: '5960608A' },
    { name: '张思成', username: 'zhangsic', uid: '5960319A' },
    { name: '李白', username: 'libai', uid: '5960320A' },
    { name: '李工', username: 'li_team', uid: '5970001A' },
    { name: '王设计', username: 'wang_sj', uid: '5970002A' },
    { name: '陈工', username: 'chen_group', uid: '5970003A' },
    { name: '刘工', username: 'liu_gc', uid: '5970004A' },
    { name: '赵工程师', username: 'zhao_team', uid: '5970005A' },
    { name: '孙同学', username: 'sun_tx', uid: '5970006A' },
    { name: '周教授', username: 'zhou_lab', uid: '5970007A' },
    { name: '吴工', username: 'wu_engineer', uid: '5970008A' },
    { name: '郑开发', username: 'zheng_dev', uid: '5970009A' },
    { name: '林未明', username: 'linwm', uid: '5970010A' },
    { name: '黄老师', username: 'huang_class', uid: '5970011A' },
    { name: '林工', username: 'lin_lg', uid: '5970012A' },
    { name: '何工程师', username: 'he_team', uid: '5970013A' },
    { name: '高工', username: 'gao_dev', uid: '5970014A' },
    { name: '罗同学', username: 'luo_group', uid: '5970015A' },
    { name: '秦工', username: 'eda_trq', uid: '5974001A' },
    { name: '尤工', username: 'eda_mq', uid: '5974003A' },
    { name: '许工', username: 'eda_zuh', uid: '5974004A' },
    { name: '邓工', username: 'zxr001', uid: '5960609A' },
    { name: '失败测试1', username: 'shibai_test1', uid: 'SB0001A' },
    { name: '失败测试2', username: 'shibai_test2', uid: 'SB0002A' },
    { name: '失败测试3', username: 'shibai_test3', uid: 'SB0003A' }
  ];

  /* ===== State ===== */
  var state = {
    data: MOCK_DATA.slice(),
    filtered: MOCK_DATA.slice(),
    page: 1,
    pageSize: 50,
    sortField: null,
    sortOrder: null,
    selected: new Set(),
    awardData: {},
    activeAward: null,
    currentEditId: null,
    hasDraft: false,
    sentTypes: {
      letter: new Set(),
      list: new Set()
    }
  };

  var _lastFailList = [];

  /* ===== Utils ===== */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function showToast(msg, type) {
    var toast = $('#toast');
    toast.textContent = msg;
    toast.className = 'toast show' + (type ? ' toast-' + type : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  function showSuccessModal(msg) {
    var modal = $('#successModal');
    var msgEl = $('#successModalMessage');
    if (msg) msgEl.textContent = msg;
    modal.hidden = false;
    clearTimeout(modal._t);
    modal._t = setTimeout(function () {
      modal.hidden = true;
    }, 2500);
  }

  /* ===== Send Log (localStorage) ===== */
  var SEND_LOG_KEY = 'jlc_send_log_v1';
  var SEND_LOG_MAX = 100;
  var ACTIVITY_NAME = '2024 嘉立创集团硬件创新大赛';

  function getSendLogs() {
    try {
      var raw = localStorage.getItem(SEND_LOG_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function addSendLog(log) {
    var logs = getSendLogs();
    log.id = Date.now();
    log.time = new Date().toISOString();
    log.activity = ACTIVITY_NAME;
    logs.unshift(log);
    if (logs.length > SEND_LOG_MAX) logs = logs.slice(0, SEND_LOG_MAX);
    try {
      localStorage.setItem(SEND_LOG_KEY, JSON.stringify(logs));
    } catch (e) {}
  }

  function clearSendLogs() {
    try {
      localStorage.removeItem(SEND_LOG_KEY);
    } catch (e) {}
  }

  function formatTime(iso) {
    var d = new Date(iso);
    var pad = function (n) { return n < 10 ? '0' + n : n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatStatusText(status) {
    var map = { published: '已发布', unpublished: '未发布', none: '未创建工程' };
    return map[status] || status;
  }

  function statusTagClass(status) {
    if (status === 'published') return 'tag-green';
    if (status === 'unpublished') return 'tag-orange';
    return 'tag-gray';
  }

  /* ===== Render Table ===== */
  function renderTable() {
    var tbody = $('#tableBody');
    var empty = $('#emptyState');
    var list = state.filtered;

    var start = (state.page - 1) * state.pageSize;
    var pageData = list.slice(start, start + state.pageSize);

    if (!pageData.length) {
      tbody.innerHTML = '';
      empty.hidden = false;
    } else {
      empty.hidden = true;
      tbody.innerHTML = pageData.map(function (row) {
        var checked = state.selected.has(row.id) ? 'checked' : '';
        var userHtml = '';
        if (row.userName) {
          userHtml += '<span class="user-name">' + escapeHtml(row.userName) + '</span>';
        }
        userHtml += '<span class="user-id">' + escapeHtml(row.userId) + '</span>';

        var projectHtml = row.project
          ? '<span class="link">' + escapeHtml(row.project) + '</span>'
          : '<span class="dash">—</span>';

        var statusHtml = row.projectStatus === 'none'
          ? '<span class="txt-plain">未创建工程</span>'
          : '<span class="tag ' + statusTagClass(row.projectStatus) + '">' + formatStatusText(row.projectStatus) + '</span>';

        var memberHtml = row.member
          ? '<span class="link">' + escapeHtml(row.member) + '</span>'
          : '<span class="dash">—</span>';

        var remarkHtml = row.remark
          ? '<span title="' + escapeHtml(row.remark) + '">' + escapeHtml(row.remark) + '</span>'
          : '<span class="dash">—</span>';

        var reportHtml = row.report
          ? '<span class="link">查看报告</span>'
          : '<span class="dash">—</span>';

        var opLinks = [
          '<span class="op-link" data-action="contact" data-id="' + row.id + '">联系报名人</span>'
        ];
        if (row.hasSupplement) {
          opLinks.push('<span class="op-link" data-action="supplement" data-id="' + row.id + '">补充资料</span>');
        }
        opLinks.push('<span class="op-link" data-action="remark" data-id="' + row.id + '">修改备注</span>');

        return '<tr data-id="' + row.id + '">' +
          '<td class="cell-center"><input type="checkbox" class="row-check" data-id="' + row.id + '" ' + checked + '></td>' +
          '<td>' + userHtml + '</td>' +
          '<td><span class="link" data-action="contact" data-id="' + row.id + '">查看</span></td>' +
          '<td>' + escapeHtml(row.event) + '</td>' +
          '<td>' + escapeHtml(row.time) + '</td>' +
          '<td><span class="tag tag-blue">' + escapeHtml(row.joinType) + '</span></td>' +
          '<td>' + memberHtml + '</td>' +
          '<td>' + projectHtml + '</td>' +
          '<td>' + statusHtml + '</td>' +
          '<td>' + escapeHtml(row.projectAttr) + '</td>' +
          '<td>' + remarkHtml + '</td>' +
          '<td>' + reportHtml + '</td>' +
          '<td class="cell-center">' +
            '<span class="sort-cell">' +
              '<svg class="sort-up" data-id="' + row.id + '" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>' +
              '<span>' + row.sort + '</span>' +
              '<svg class="sort-down" data-id="' + row.id + '" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
            '</span>' +
          '</td>' +
          '<td>' + opLinks.join('') + '</td>' +
        '</tr>';
      }).join('');
    }

    updateCheckAllState();
    renderPagination();
    updateSelectedCount();
  }

  /* ===== Pagination ===== */
  function renderPagination() {
    var pgTotal = $('#pgTotal');
    if (!pgTotal) return;
    var total = state.filtered.length;
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    var current = state.page;

    pgTotal.textContent = '共 ' + total + ' 条';

    var container = $('#paginationBtns');
    var html = '';

    html += '<button class="pg-btn" data-page="prev"' + (current === 1 ? ' disabled' : '') + '>' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</button>';

    var pages = [];
    if (totalPages <= 7) {
      for (var i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      var startP = Math.max(2, current - 1);
      var endP = Math.min(totalPages - 1, current + 1);
      for (var j = startP; j <= endP; j++) pages.push(j);
      if (current < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    pages.forEach(function (p) {
      if (p === '...') {
        html += '<span class="pg-dots">...</span>';
      } else {
        html += '<button class="pg-btn' + (p === current ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
      }
    });

    html += '<button class="pg-btn" data-page="next"' + (current === totalPages ? ' disabled' : '') + '>' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</button>';

    html += '<span class="pg-jump">前往<input type="text" id="jumpInput" value="' + current + '">页</span>';

    container.innerHTML = html;
  }

  function goToPage(page) {
    var totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    if (page === state.page) return;
    state.page = page;
    renderTable();
    $('.table-wrap').scrollTop = 0;
  }

  /* ===== Selection ===== */
  function updateCheckAllState() {
    var checkAll = $('#checkAll');
    var start = (state.page - 1) * state.pageSize;
    var pageData = state.filtered.slice(start, start + state.pageSize);
    if (!pageData.length) {
      checkAll.checked = false;
      checkAll.indeterminate = false;
      return;
    }
    var selectedOnPage = pageData.filter(function (r) { return state.selected.has(r.id); }).length;
    checkAll.checked = selectedOnPage === pageData.length;
    checkAll.indeterminate = selectedOnPage > 0 && selectedOnPage < pageData.length;
  }

  function updateSelectedCount() {
    var el = $('#selectedCount');
    var n = state.selected.size;
    el.textContent = '已选 ' + n + ' 项';
    el.classList.toggle('show', n > 0);
  }

  /* ===== Filter ===== */
  function applyFilters() {
    var user = $('#filterUser').value.trim().toLowerCase();
    var member = $('#filterMember').value.trim().toLowerCase();
    var activityStatus = $('#filterActivityStatus').value;
    var event = $('#filterEvent').value;
    var projectStatus = $('#filterProjectStatus').value;
    var auditStatus = $('#filterAuditStatus').value;
    var joinType = $('#filterJoinType').value;
    var projectAttr = $('#filterProject').value;
    var report = $('#filterReport').value;

    state.filtered = state.data.filter(function (row) {
      if (user && !(row.userName || '').toLowerCase().includes(user) && !(row.userId || '').toLowerCase().includes(user)) return false;
      if (member && !(row.member || '').toLowerCase().includes(member)) return false;
      if (event && row.event !== event) return false;
      if (projectStatus && row.projectStatus !== projectStatus) return false;
      if (joinType && row.joinType !== joinType) return false;
      if (projectAttr === 'public' && row.projectAttr !== '公开') return false;
      if (projectAttr === 'private' && row.projectAttr !== '私有') return false;
      if (report === 'submitted' && !row.report) return false;
      if (report === 'not_submitted' && row.report) return false;
      return true;
    });

    if (state.sortField) {
      sortData();
    }

    state.page = 1;
    state.selected.clear();
    renderTable();
  }

  function resetFilters() {
    $('#filterUser').value = '';
    $('#filterMember').value = '';
    $('#filterActivityStatus').value = '';
    $('#filterEvent').value = '';
    $('#filterProjectStatus').value = '';
    $('#filterAuditStatus').value = '';
    $('#filterJoinType').value = '';
    $('#filterRecord').value = 'active';
    $('#filterSupplement').value = '';
    $('#filterProject').value = '';
    $('#filterReport').value = '';
    $('#filterDateStart').value = '';
    $('#filterDateEnd').value = '';
    applyFilters();
  }

  /* ===== Sort ===== */
  function sortData() {
    var field = state.sortField;
    var order = state.sortOrder;
    if (!field) return;

    state.filtered.sort(function (a, b) {
      var va = '', vb = '';
      if (field === 'user') {
        va = (a.userName || a.userId || '').toLowerCase();
        vb = (b.userName || b.userId || '').toLowerCase();
      } else if (field === 'time') {
        va = a.time;
        vb = b.time;
      }
      if (va < vb) return order === 'asc' ? -1 : 1;
      if (va > vb) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  function toggleSort(field, thEl) {
    var ths = $$('.sortable');
    ths.forEach(function (th) {
      if (th !== thEl) {
        th.classList.remove('sorted-asc', 'sorted-desc');
      }
    });

    if (state.sortField !== field) {
      state.sortField = field;
      state.sortOrder = 'asc';
      thEl.classList.add('sorted-asc');
      thEl.classList.remove('sorted-desc');
    } else if (state.sortOrder === 'asc') {
      state.sortOrder = 'desc';
      thEl.classList.add('sorted-desc');
      thEl.classList.remove('sorted-asc');
    } else {
      state.sortField = null;
      state.sortOrder = null;
      thEl.classList.remove('sorted-asc', 'sorted-desc');
      state.filtered = state.data.filter(function (r) { return state.filtered.indexOf(r) !== -1; });
      state.filtered = MOCK_DATA.filter(function (r) { return state.filtered.some(function (f) { return f.id === r.id; }); });
    }
    if (state.sortField) sortData();
    renderTable();
  }

  /* ===== Sidebar ===== */
  function toggleSidebar(force) {
    var sidebar = $('#sidebar');
    var overlay = $('#sidebarOverlay');
    var isOpen = sidebar.classList.contains('show');
    var shouldOpen = force !== undefined ? force : !isOpen;

    if (window.innerWidth >= 1024) {
      sidebar.classList.toggle('collapsed', !shouldOpen);
    } else {
      sidebar.classList.toggle('show', shouldOpen);
      overlay.classList.toggle('show', shouldOpen);
    }
  }

  function setupMenuToggle() {
    $('#menu').addEventListener('click', function (e) {
      var item = e.target.closest('.menu-item');
      if (!item) return;

      // 多页原型跳转：菜单项带 data-page 时导航到对应页面
      if (item.dataset.page) {
        location.href = item.dataset.page;
        return;
      }

      var level = item.dataset.level;
      if (level === '0' || (level === '1' && item.nextElementSibling && item.nextElementSibling.classList.contains('menu-children'))) {
        item.classList.toggle('parent-open');
      }

      if (item.classList.contains('lv2') && !item.classList.contains('active')) {
        $$('.menu-item.lv2').forEach(function (el) { el.classList.remove('active'); });
        item.classList.add('active');
      }
    });
  }

  /* ===== Award Modal ===== */
  function setupAwardModal() {
    var openBtn = $('#awardNotifyBtn');
    if (!openBtn) return;
    var modal = $('#awardModal');
    var closeX = $('#awardModalClose');
    var btnCancel = $('#awardModalCancel');
    var btnOk = $('#awardModalOk');
    var cbLetter = $('#typeLetter');
    var cbList = $('#typeList');
    var edList = $('#editorList');
    var titleList = $('#titleList');
    var urlList = $('#urlList');
    var awardInput = $('#awardInput');
    var awardAddBtn = $('#awardAddBtn');
    var awardTags = $('#awardTags');
    var awardContentBlock = $('#awardContentBlock');
    var awardContentEditor = $('#awardContentEditor');
    var activeAwardName = $('#activeAwardName');
    var userSearch = $('#userSearch');
    var userDropdown = $('#userDropdown');
    var userChips = $('#userChips');

    var awardData = state.awardData;
    var activeAward = state.activeAward;

    function currentAward() { return activeAward; }
    function awardObj(award) {
      if (!award) return null;
      if (!awardData[award]) awardData[award] = { users: [], content: '' };
      return awardData[award];
    }
    function winnersOf(award) {
      var obj = awardObj(award);
      return obj ? obj.users : [];
    }
    function totalWinners() {
      return Object.keys(awardData).reduce(function (n, k) { return n + (awardData[k].users ? awardData[k].users.length : 0); }, 0);
    }
    function userKey(u) { return u.uid; }

    function renderAwardContent() {
      if (!activeAward) {
        awardContentBlock.hidden = true;
        return;
      }
      awardContentBlock.hidden = false;
      activeAwardName.textContent = activeAward;
      var obj = awardObj(activeAward);
      if (awardContentEditor.value !== obj.content) {
        awardContentEditor.value = obj.content;
      }
      $('#awardContentCount').textContent = (obj.content || '').length;
    }

    function renderAwardTags() {
      var names = Object.keys(awardData);
      if (!names.length) {
        awardTags.innerHTML = '<span class="chips-empty">尚未添加奖项，请先输入奖项名称后点击「添加奖项」</span>';
        return;
      }
      awardTags.innerHTML = names.map(function (n) {
        var count = awardData[n].users ? awardData[n].users.length : 0;
        var hasContent = awardData[n].content && awardData[n].content.trim();
        return '<span class="award-tag' + (n === activeAward ? ' active' : '') + '" data-name="' + n + '">' +
          escapeHtml(n) + ' · ' + count + '人' +
          (hasContent ? '<span class="award-tag-dot"></span>已填内容' : '') +
          '<span class="chip-x" data-award="' + n + '">×</span>' +
          '</span>';
      }).join('');
    }

    function renderChips() {
      if (!activeAward) {
        userChips.innerHTML = '<span class="chips-empty">请先添加并选中奖项</span>';
        return;
      }
      var list = winnersOf(activeAward);
      if (!list.length) {
        userChips.innerHTML = '<span class="chips-empty">尚未添加「' + escapeHtml(activeAward) + '」的获奖用户</span>';
        return;
      }
      userChips.innerHTML = list.map(function (u, i) {
        return '<span class="user-chip">' + escapeHtml(u.username || u.name) + ' · ' + escapeHtml(u.uid) +
          '<span class="chip-x" data-idx="' + i + '">×</span></span>';
      }).join('');
    }

    function positionDropdown() {
      if (userDropdown.hidden) return;
      var rect = userSearch.getBoundingClientRect();
      var dropdownWidth = rect.width;
      var top = rect.bottom + 4;
      var maxHeight = window.innerHeight - top - 16;
      if (maxHeight < 120) maxHeight = 120;
      if (maxHeight > 280) maxHeight = 280;
      userDropdown.style.left = rect.left + 'px';
      userDropdown.style.top = top + 'px';
      userDropdown.style.width = dropdownWidth + 'px';
      userDropdown.style.maxHeight = maxHeight + 'px';
    }

    function renderDropdown(keyword) {
      if (!currentAward()) { userDropdown.hidden = true; return; }
      var keys = winnersOf(currentAward()).map(userKey);
      var kw = (keyword || '').trim().toLowerCase();
      var matches = MOCK_USERS.filter(function (u) {
        return keys.indexOf(userKey(u)) === -1 &&
          (!kw || (u.username || '').toLowerCase().indexOf(kw) !== -1 || u.uid.toLowerCase().indexOf(kw) !== -1 || u.name.toLowerCase().indexOf(kw) !== -1);
      }).slice(0, 10);
      userDropdown.innerHTML = matches.length
        ? matches.map(function (u) {
            return '<div class="user-option" data-uid="' + u.uid + '" data-name="' + u.name + '" data-username="' + (u.username || '') + '">' +
              '<span class="user-name">' + escapeHtml(u.username || u.name) + '</span>' +
              '<span class="user-uid">' + escapeHtml(u.uid) + '</span>' +
              '</div>';
          }).join('')
        : '<div class="user-option user-empty">无匹配用户</div>';
      userDropdown.hidden = false;
      positionDropdown();
    }

    function setFieldError(inputEl, errEl) {
      if (inputEl) inputEl.classList.add('input-error');
      if (errEl) errEl.hidden = false;
    }
    function clearFieldError(inputEl, errEl) {
      if (inputEl) inputEl.classList.remove('input-error');
      if (errEl) errEl.hidden = true;
    }
    function clearAllErrors() {
      clearFieldError(awardInput, $('#errAward'));
      clearFieldError(awardContentEditor, $('#errAwardContent'));
      clearFieldError(userSearch, $('#errUsers'));
      clearFieldError(edList, $('#errList'));
      clearFieldError(titleList, $('#errTitle'));
      clearFieldError(urlList, $('#errUrl'));
    }

    function syncEditors() {
      var letterSection = $('#letterSection');
      var listSection = $('#listSection');
      var reqAwardConfig = $('#reqAwardConfig');
      var reqAwardContent = $('#reqAwardContent');
      var reqList = $('#reqList');

      letterSection.hidden = !cbLetter.checked;
      listSection.hidden = !cbList.checked;
      reqAwardConfig.hidden = !cbLetter.checked;
      reqAwardContent.hidden = !cbLetter.checked;
      reqList.hidden = !cbList.checked;

      clearAllErrors();

      if (!cbLetter.checked) {
        awardData = {};
        state.awardData = {};
        activeAward = null;
        state.activeAward = null;
        awardInput.value = '';
        userSearch.value = '';
        userDropdown.hidden = true;
        awardContentEditor.value = '';
        awardContentBlock.hidden = true;
        renderAwardTags();
        renderChips();
      }
      if (!cbList.checked) {
        edList.value = '';
        titleList.value = '';
        urlList.value = '';
      }
    }

    function openModal() { modal.hidden = false; }
    function closeModal() { modal.hidden = true; }
    function resetModal() {
      cbLetter.checked = false;
      cbList.checked = false;
      awardData = {};
      state.awardData = {};
      activeAward = null;
      state.activeAward = null;
      awardInput.value = '';
      userSearch.value = '';
      userDropdown.hidden = true;
      awardContentEditor.value = '';
      awardContentBlock.hidden = true;
      edList.value = '';
      titleList.value = '';
      urlList.value = '';
      $('#awardContentCount').textContent = '0';
      $('#listCount').textContent = '0';
      syncEditors();
      clearAllErrors();
      renderAwardTags();
      renderChips();
      state.hasDraft = false;
    }
    function restoreDraft() {
      syncEditors();
      renderAwardTags();
      renderAwardContent();
      renderChips();
      $('#awardContentCount').textContent = awardContentEditor.value.length;
      $('#listCount').textContent = edList.value.length;
    }

    openBtn.addEventListener('click', function () {
      if (state.selected.size === 0) {
        window.__showAlert && window.__showAlert('请选择一组数据');
        return;
      }
      if (!state.hasDraft) {
        resetModal();
      } else {
        restoreDraft();
      }
      openModal();
    });
    closeX.addEventListener('click', function () {
      state.hasDraft = true;
      closeModal();
    });
    btnCancel.addEventListener('click', function () {
      state.hasDraft = true;
      closeModal();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        state.hasDraft = true;
        closeModal();
      }
    });

    function addAward() {
      var name = awardInput.value.trim();
      if (!name) { setFieldError(awardInput, $('#errAward')); return; }
      if (awardData[name]) { showToast('该奖项已存在', 'error'); awardInput.value = ''; return; }
      awardData[name] = { users: [], content: '' };
      state.awardData[name] = awardData[name];
      awardInput.value = '';
      activeAward = name;
      state.activeAward = name;
      clearFieldError(awardInput, $('#errAward'));
      renderAwardTags();
      renderAwardContent();
      renderChips();
    }
    awardAddBtn.addEventListener('click', addAward);
    awardInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); addAward(); }
    });

    awardTags.addEventListener('click', function (e) {
      var x = e.target.closest('.chip-x');
      if (x) {
        var del = x.getAttribute('data-award');
        delete awardData[del];
        delete state.awardData[del];
        if (activeAward === del) activeAward = Object.keys(awardData)[0] || null;
        if (state.activeAward === del) state.activeAward = Object.keys(state.awardData)[0] || null;
        renderAwardTags();
        renderAwardContent();
        renderChips();
        return;
      }
      var tag = e.target.closest('.award-tag');
      if (tag) {
        if (activeAward) {
          var prev = awardObj(activeAward);
          if (prev) prev.content = awardContentEditor.value;
        }
        activeAward = tag.getAttribute('data-name');
        state.activeAward = activeAward;
        userSearch.value = '';
        userDropdown.hidden = true;
        clearFieldError(awardContentEditor, $('#errAwardContent'));
        renderAwardTags();
        renderAwardContent();
        renderChips();
      }
    });

    userDropdown.addEventListener('click', function (e) {
      var opt = e.target.closest('.user-option');
      if (!opt || opt.classList.contains('user-empty')) return;
      winnersOf(currentAward()).push({ name: opt.getAttribute('data-name'), uid: opt.getAttribute('data-uid'), username: opt.getAttribute('data-username') });
      state.awardData[currentAward()] = winnersOf(currentAward());
      userSearch.value = '';
      userDropdown.hidden = true;
      clearFieldError(userSearch, $('#errUsers'));
      renderAwardTags();
      renderChips();
    });
    userChips.addEventListener('click', function (e) {
      var x = e.target.closest('.chip-x');
      if (!x) return;
      winnersOf(currentAward()).splice(parseInt(x.getAttribute('data-idx'), 10), 1);
      state.awardData[currentAward()] = winnersOf(currentAward());
      renderAwardTags();
      renderChips();
    });
    document.addEventListener('click', function (e) {
      if (!userDropdown.hidden && !e.target.closest('.user-picker')) userDropdown.hidden = true;
    });
    window.addEventListener('resize', positionDropdown);
    var modalBody = awardModal.querySelector('.modal-body');
    if (modalBody) modalBody.addEventListener('scroll', positionDropdown);

    function showSendResultAlert(successCount, failCount, failList) {
      var alert = $('#sendResultAlert');
      var textEl = $('#sendResultText');
      var exportBtn = $('#sendResultExportBtn');

      _lastFailList = failList || [];

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
      if (successCount > 0 && failCount > 0) {
        alert.classList.add('has-fail');
      } else if (successCount === 0) {
        alert.classList.add('all-fail');
      }

      if (failCount > 0 && failList && failList.length) {
        exportBtn.hidden = false;
      } else {
        exportBtn.hidden = true;
      }

      alert.hidden = false;
      clearTimeout(alert._t);
      alert._t = setTimeout(function () {
        alert.hidden = true;
      }, 4000);

      exportBtn.onclick = exportFailList;
    }

    function exportFailList() {
      if (!_lastFailList || !_lastFailList.length) return;
      var header = '参赛人账号,客编,失败原因\n';
      var rows = _lastFailList.map(function (u) {
        return '"' + (u.username || u.name) + '","' + u.uid + '","' + u.reason + '"';
      }).join('\n');
      var csv = '\uFEFF' + header + rows;
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '发送失败名单_' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function mockSend(users) {
      var success = [];
      var fail = [];
      var failReasons = ['用户状态异常', '系统异常', '网络连接超时', '账号已注销'];
      var testFailMap = {
        'shibai_test1': '用户状态异常',
        'shibai_test2': '账号已注销',
        'shibai_test3': '网络连接超时'
      };
      users.forEach(function (u) {
        var uname = u.username || '';
        if (testFailMap[uname]) {
          fail.push({ name: u.name, username: u.username, uid: u.uid, reason: testFailMap[uname] });
        } else if (Math.random() < 0.82) {
          success.push(u);
        } else {
          var reason = failReasons[Math.floor(Math.random() * failReasons.length)];
          fail.push({ name: u.name, username: u.username, uid: u.uid, reason: reason });
        }
      });
      return { success: success, fail: fail };
    }

    function doSend() {
      var checked = state.selected.size;
      var total = totalWinners();
      var awardCount = Object.keys(awardData).length;
      var perAward = Object.keys(awardData)
        .filter(function (k) { return awardData[k].users && awardData[k].users.length; })
        .map(function (k) { return k + ' ' + awardData[k].users.length + ' 人'; });
      var lines = [];
      var hasError = false;
      if (cbLetter.checked) {
        if (!awardCount) { setFieldError(awardInput, $('#errAward')); hasError = true; }
        if (!total) { setFieldError(userSearch, $('#errUsers')); hasError = true; }
        var emptyContentAwards = [];
        Object.keys(awardData).forEach(function (k) {
          var obj = awardData[k];
          if (obj.users && obj.users.length && (!obj.content || !obj.content.trim())) {
            emptyContentAwards.push(k);
          }
        });
        if (emptyContentAwards.length) {
          if (activeAward && emptyContentAwards.indexOf(activeAward) !== -1) {
            setFieldError(awardContentEditor, $('#errAwardContent'));
          }
          hasError = true;
          $('#errAwardContent').textContent = '以下奖项未填写通知内容：' + emptyContentAwards.join('、');
          $('#errAwardContent').hidden = false;
        }
      }
      if (cbList.checked) {
        if (!edList.value.trim()) { setFieldError(edList, $('#errList')); hasError = true; }
        if (!titleList.value.trim()) { setFieldError(titleList, $('#errTitle')); hasError = true; }
        if (!urlList.value.trim()) { setFieldError(urlList, $('#errUrl')); hasError = true; }
      }
      if (hasError) return;
      if (cbLetter.checked) {
        lines.push('· 获奖通知 → 按奖项发送：' + perAward.join('、') + '（共 ' + total + ' 人，每个奖项通知内容不同）');
      }
      if (cbList.checked) {
        lines.push('· 获奖名单公示 → 已勾选报名用户 ' + checked + ' 人 + 获奖用户 ' + total + ' 人');
        if (cbLetter.checked && total) {
          lines.push('· 其中 ' + total + ' 名获奖用户在两个名单中均被选择，将同时收到两条通知（获奖通知 + 获奖名单公示）');
        }
      }
      if (!lines.length) { showToast('请先选择通知类型', 'error'); return; }

      btnOk.disabled = true;
      btnOk.textContent = '发送中...';

      setTimeout(function () {
        btnOk.disabled = false;
        btnOk.textContent = '发送';

        var allLetterUsers = [];
        if (cbLetter.checked) {
          Object.keys(awardData).forEach(function (k) {
            if (awardData[k].users) {
              allLetterUsers = allLetterUsers.concat(awardData[k].users);
            }
          });
        }

        var allListUsers = [];
        if (cbList.checked) {
          state.filtered.forEach(function (row) {
            if (state.selected.has(row.id)) {
              allListUsers.push({ name: row.userName, username: row.member, uid: row.userId });
            }
          });
          if (cbLetter.checked) {
            allLetterUsers.forEach(function (u) {
              if (!allListUsers.some(function (x) { return x.uid === u.uid; })) {
                allListUsers.push(u);
              }
            });
          }
        }

        var letterResult = cbLetter.checked ? mockSend(allLetterUsers) : { success: [], fail: [] };
        var listResult = cbList.checked ? mockSend(allListUsers) : { success: [], fail: [] };

        var allSuccessUids = {};
        var allFailMap = {};
        letterResult.success.forEach(function (u) { allSuccessUids[u.uid] = true; });
        listResult.success.forEach(function (u) { allSuccessUids[u.uid] = true; });
        letterResult.fail.forEach(function (u) {
          if (!allFailMap[u.uid]) allFailMap[u.uid] = { name: u.name, username: u.username, uid: u.uid, reasons: [] };
          allFailMap[u.uid].reasons.push('获奖通知：' + u.reason);
        });
        listResult.fail.forEach(function (u) {
          if (!allFailMap[u.uid]) allFailMap[u.uid] = { name: u.name, username: u.username, uid: u.uid, reasons: [] };
          allFailMap[u.uid].reasons.push('获奖名单公示：' + u.reason);
        });

        var successCount = Object.keys(allSuccessUids).length;
        var failList = Object.keys(allFailMap).map(function (uid) {
          var u = allFailMap[uid];
          return { name: u.name, username: u.username, uid: u.uid, reason: u.reasons.join('；') };
        });
        var failCount = failList.length;

        if (cbLetter.checked) {
          letterResult.success.forEach(function (u) { state.sentTypes.letter.add(u.uid); });
        }
        if (cbList.checked) {
          listResult.success.forEach(function (u) { state.sentTypes.list.add(u.uid); });
        }

        addSendLog({
          types: {
            letter: cbLetter.checked,
            list: cbList.checked
          },
          successCount: successCount,
          failCount: failCount,
          failList: failList
        });

        showSendResultAlert(successCount, failCount, failList);

        if (successCount > 0 && failCount === 0) {
          state.hasDraft = false;
          resetModal();
        }
        closeModal();
      }, 1200);
    }

    function checkResendAndSend() {
      var letterUsers = [];
      if (cbLetter.checked) {
        Object.keys(awardData).forEach(function (k) {
          if (awardData[k].users) letterUsers = letterUsers.concat(awardData[k].users);
        });
      }
      var listUsers = [];
      if (cbList.checked) {
        state.filtered.forEach(function (row) {
          if (state.selected.has(row.id)) listUsers.push(row);
        });
      }

      var dupMap = {};

      letterUsers.forEach(function (u) {
        if (state.sentTypes.letter.has(u.uid)) {
          if (!dupMap[u.uid]) dupMap[u.uid] = { name: u.name, username: u.username, uid: u.uid, types: [] };
          dupMap[u.uid].types.push('获奖通知');
        }
      });
      listUsers.forEach(function (u) {
        if (state.sentTypes.list.has(u.uid)) {
          if (!dupMap[u.uid]) dupMap[u.uid] = { name: u.name, username: u.username, uid: u.uid, types: [] };
          if (dupMap[u.uid].types.indexOf('获奖名单公示') < 0) {
            dupMap[u.uid].types.push('获奖名单公示');
          }
        }
      });

      var dupUsers = Object.keys(dupMap).map(function (uid) { return dupMap[uid]; });

      if (dupUsers.length === 0) {
        doSend();
        return;
      }

      showResendConfirm(dupUsers);
    }

    var _resendDupList = [];

    function showResendConfirm(dupUsers) {
      _resendDupList = dupUsers;

      var alert = $('#resendConfirmAlert');
      var titleEl = $('#resendConfirmTitle');
      var usersEl = $('#resendConfirmUsers');
      var exportBtn = $('#resendConfirmExport');

      var dupTypes = { letter: false, list: false };
      dupUsers.forEach(function (u) {
        if (u.types.indexOf('获奖通知') >= 0) dupTypes.letter = true;
        if (u.types.indexOf('获奖名单公示') >= 0) dupTypes.list = true;
      });
      var typeLabels = [];
      if (dupTypes.letter) typeLabels.push('获奖通知');
      if (dupTypes.list) typeLabels.push('获奖名单公示');
      titleEl.textContent = '该活动的【' + typeLabels.join('、') + '】有 ' + dupUsers.length + ' 位用户已发送过，确定要再次发送吗？';

      var showCount = dupUsers.length > 5 ? 5 : dupUsers.length;
      var rowsHtml = dupUsers.slice(0, showCount).map(function (u) {
        var tags = u.types.map(function (t) {
          var cls = t === '获奖通知' ? '' : 'list-tag';
          return '<span class="resend-user-tag ' + cls + '">' + t + '</span>';
        }).join('');
        return '<div class="resend-user-row">' +
          '<span class="resend-user-name">' + escapeHtml(u.uid) + '</span>' +
          '<span class="resend-user-tags">' + tags + '</span>' +
          '</div>';
      }).join('');

      if (dupUsers.length > 5) {
        rowsHtml += '<div class="resend-user-more">等共 ' + dupUsers.length + ' 位用户</div>';
      }

      usersEl.innerHTML = rowsHtml;
      exportBtn.hidden = dupUsers.length <= 5;

      alert.hidden = false;

      $('#resendConfirmOk').onclick = function () {
        alert.hidden = true;
        doSend();
      };
      $('#resendConfirmCancel').onclick = function () {
        alert.hidden = true;
      };
      exportBtn.onclick = exportResendDupList;
    }

    function exportResendDupList() {
      if (!_resendDupList || !_resendDupList.length) return;
      var header = '参赛人账号,客编,已发送类型\n';
      var rows = _resendDupList.map(function (u) {
        return '"' + u.username + '","' + u.uid + '","' + u.types.join('、') + '"';
      }).join('\n');
      var csv = '\uFEFF' + header + rows;
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '重复发送用户名单_' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function validateForm() {
      var awardCount = Object.keys(awardData).length;
      var total = totalWinners();
      var hasError = false;
      clearAllErrors();
      if (cbLetter.checked) {
        if (!awardCount) { setFieldError(awardInput, $('#errAward')); hasError = true; }
        if (!total) { setFieldError(userSearch, $('#errUsers')); hasError = true; }
        var emptyContentAwards = [];
        Object.keys(awardData).forEach(function (k) {
          var obj = awardData[k];
          if (obj.users && obj.users.length && (!obj.content || !obj.content.trim())) {
            emptyContentAwards.push(k);
          }
        });
        if (emptyContentAwards.length) {
          if (activeAward && emptyContentAwards.indexOf(activeAward) !== -1) {
            setFieldError(awardContentEditor, $('#errAwardContent'));
          }
          hasError = true;
          $('#errAwardContent').textContent = '以下奖项未填写通知内容：' + emptyContentAwards.join('、');
          $('#errAwardContent').hidden = false;
        }
      }
      if (cbList.checked) {
        if (!edList.value.trim()) { setFieldError(edList, $('#errList')); hasError = true; }
        if (!titleList.value.trim()) { setFieldError(titleList, $('#errTitle')); hasError = true; }
        if (!urlList.value.trim()) { setFieldError(urlList, $('#errUrl')); hasError = true; }
      }
      if (hasError) return false;
      if (!cbLetter.checked && !cbList.checked) {
        showToast('请先选择通知类型', 'error');
        return false;
      }
      return true;
    }

    var sendConfirmModal = $('#sendConfirmModal');
    var sendConfirmOk = $('#sendConfirmOk');
    var sendConfirmCancel = $('#sendConfirmCancel');

    function showSendConfirm() {
      sendConfirmModal.hidden = false;
    }
    function hideSendConfirm() {
      sendConfirmModal.hidden = true;
    }
    sendConfirmCancel.addEventListener('click', hideSendConfirm);
    sendConfirmOk.addEventListener('click', function () {
      hideSendConfirm();
      checkResendAndSend();
    });
    sendConfirmModal.addEventListener('click', function (e) {
      if (e.target === sendConfirmModal) hideSendConfirm();
    });

    var previewModal = $('#previewModal');
    var previewBody = $('#previewBody');
    var previewModalClose = $('#previewModalClose');
    var previewModalCancel = $('#previewModalCancel');
    var previewModalOk = $('#previewModalOk');
    var previewBtn = $('#previewBtn');

    function openPreview() {
      if (!cbLetter.checked && !cbList.checked) {
        showToast('请先选择通知类型', 'error');
        return;
      }
      renderPreview();
      previewModal.hidden = false;
    }
    function closePreview() {
      previewModal.hidden = true;
    }
    previewBtn.addEventListener('click', openPreview);
    previewModalClose.addEventListener('click', closePreview);
    previewModalCancel.addEventListener('click', closePreview);
    previewModal.addEventListener('click', function (e) {
      if (e.target === previewModal) closePreview();
    });
    previewModalOk.addEventListener('click', function () {
      closePreview();
      if (!validateForm()) return;
      showSendConfirm();
    });

    function renderPreview() {
      var html = '';

      if (cbLetter.checked) {
        var awardKeys = Object.keys(awardData);
        html += '<div class="preview-section">';
        html += '<div class="preview-section-title">获奖通知</div>';
        if (!awardKeys.length) {
          html += '<div class="preview-empty">尚未配置奖项</div>';
        } else {
          awardKeys.forEach(function (k) {
            var obj = awardData[k];
            var userCount = obj.users ? obj.users.length : 0;
            var userList = obj.users && obj.users.length
              ? obj.users.map(function (u) { return u.username + '·' + u.uid; }).join('、')
              : '暂无获奖用户';
            var content = obj.content && obj.content.trim() ? obj.content : '（未填写通知内容）';
            html += '<div class="preview-award-block">';
            html += '<div class="preview-award-name">' + escapeHtml(k) + '（' + userCount + ' 人）</div>';
            html += '<div class="preview-award-users">获奖用户：' + escapeHtml(userList) + '</div>';
            html += '<div class="preview-award-content">' + escapeHtml(content) + '</div>';
            html += '</div>';
          });
        }
        html += '</div>';
      }

      if (cbList.checked) {
        var checkedCount = state.selected.size;
        var winnerTotal = totalWinners();
        html += '<div class="preview-section">';
        html += '<div class="preview-section-title">获奖名单公示</div>';
        html += '<div class="preview-meta-row"><div class="preview-meta-label">文章标题</div><div class="preview-meta-value">' + escapeHtml(titleList.value || '（未填写）') + '</div></div>';
        html += '<div class="preview-meta-row"><div class="preview-meta-label">文章地址</div><div class="preview-meta-value">' + escapeHtml(urlList.value || '（未填写）') + '</div></div>';
        html += '<div class="preview-meta-row"><div class="preview-meta-label">发送对象</div><div class="preview-meta-value">已勾选报名用户 ' + checkedCount + ' 人</div></div>';
        var articleTitle = titleList.value || '（未填写文章标题）';
        var listContent = edList.value || '（未填写公示内容）';
        var jumpHtml = '<span class="preview-jump-link">点击跳转「' + escapeHtml(articleTitle) + '」</span>';
        html += '<div class="preview-content-box">' + escapeHtml(listContent) + jumpHtml + '</div>';
        html += '</div>';
      }

      previewBody.innerHTML = html;
    }

    btnOk.addEventListener('click', function () {
      if (!validateForm()) return;
      showSendConfirm();
    });

    $('#sendLogBtn').addEventListener('click', openSendLogModal);

    function openSendLogModal() {
      var modal = $('#sendLogModal');
      var tbody = $('#sendLogBody');
      var empty = $('#sendLogEmpty');
      var tableWrap = $('#sendLogTableWrap');
      var logs = getSendLogs();

      if (!logs.length) {
        empty.hidden = false;
        tableWrap.hidden = true;
      } else {
        empty.hidden = true;
        tableWrap.hidden = false;
        tbody.innerHTML = logs.map(function (log) {
          var typeHtml = '';
          if (log.types && log.types.letter) typeHtml += '<span class="log-type">获奖通知</span>';
          if (log.types && log.types.list) typeHtml += '<span class="log-type list-type">获奖名单公示</span>';
          var failBtn = log.failCount > 0
            ? '<button class="log-action-btn" data-log-id="' + log.id + '">导出失败名单</button>'
            : '<button class="log-action-btn disabled" disabled>无失败</button>';
          return '<tr>' +
            '<td class="log-time">' + formatTime(log.time) + '</td>' +
            '<td class="log-activity">' + escapeHtml(log.activity || '') + '</td>' +
            '<td>' + typeHtml + '</td>' +
            '<td class="log-success">' + log.successCount + '</td>' +
            '<td class="log-fail">' + log.failCount + '</td>' +
            '<td class="log-action">' + failBtn + '</td>' +
            '</tr>';
        }).join('');
      }

      modal.hidden = false;
    }

    $('#sendLogModalClose').addEventListener('click', function () {
      $('#sendLogModal').hidden = true;
    });
    $('#sendLogOkBtn').addEventListener('click', function () {
      $('#sendLogModal').hidden = true;
    });
    $('#sendLogModal').addEventListener('click', function (e) {
      if (e.target.id === 'sendLogModal') $('#sendLogModal').hidden = true;
    });
    $('#sendLogClearBtn').addEventListener('click', function () {
      if (!confirm('确定要清空所有发送记录吗？')) return;
      clearSendLogs();
      openSendLogModal();
    });
    $('#sendLogBody').addEventListener('click', function (e) {
      var btn = e.target.closest('.log-action-btn');
      if (!btn || btn.classList.contains('disabled')) return;
      var logId = parseInt(btn.getAttribute('data-log-id'), 10);
      if (!logId) return;
      var logs = getSendLogs();
      var log = logs.find(function (l) { return l.id === logId; });
      if (!log || !log.failList || !log.failList.length) return;
      exportFailListForLog(log.failList);
    });

    function exportFailListForLog(failList) {
      if (!failList || !failList.length) return;
      var header = '参赛人账号,客编,失败原因\n';
      var rows = failList.map(function (u) {
        return '"' + (u.username || u.name) + '","' + u.uid + '","' + u.reason + '"';
      }).join('\n');
      var csv = '\uFEFF' + header + rows;
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '发送失败名单_' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    cbLetter.addEventListener('change', syncEditors);
    cbList.addEventListener('change', syncEditors);

    awardContentEditor.addEventListener('input', function () {
      var obj = awardObj(activeAward);
      if (obj) obj.content = awardContentEditor.value;
      $('#awardContentCount').textContent = awardContentEditor.value.length;
      clearFieldError(awardContentEditor, $('#errAwardContent'));
      renderAwardTags();
    });
    edList.addEventListener('input', function () {
      $('#listCount').textContent = edList.value.length;
      clearFieldError(edList, $('#errList'));
    });
    urlList.addEventListener('input', function () { clearFieldError(urlList, $('#errUrl')); });
    titleList.addEventListener('input', function () { clearFieldError(titleList, $('#errTitle')); });
    awardInput.addEventListener('input', function () { clearFieldError(awardInput, $('#errAward')); });
    userSearch.addEventListener('input', function () { clearFieldError(userSearch, $('#errUsers')); renderDropdown(userSearch.value); });
    userSearch.addEventListener('focus', function () { renderDropdown(userSearch.value); });

    renderAwardTags();
    renderAwardContent();
    renderChips();
  }

  /* ===== Remark Modal ===== */
  function setupRemarkModal() {
    var modal = $('#remarkModal');
    if (!modal) return;
    var closeBtn = $('#remarkModalClose');
    var cancelBtn = $('#remarkModalCancel');
    var okBtn = $('#remarkModalOk');
    var textarea = $('#remarkText');
    var countEl = $('#remarkCount');

    function openModal(id) {
      var row = state.data.find(function (r) { return r.id === id; });
      if (!row) return;
      state.currentEditId = id;
      textarea.value = row.remark || '';
      countEl.textContent = textarea.value.length;
      modal.hidden = false;
      setTimeout(function () { textarea.focus(); }, 100);
    }
    function closeModal() { modal.hidden = true; state.currentEditId = null; }

    textarea.addEventListener('input', function () {
      countEl.textContent = textarea.value.length;
    });

    okBtn.addEventListener('click', function () {
      if (state.currentEditId !== null) {
        var row = state.data.find(function (r) { return r.id === state.currentEditId; });
        if (row) {
          row.remark = textarea.value.trim();
          renderTable();
          showToast('备注修改成功', 'success');
        }
      }
      closeModal();
    });
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    window.__openRemark = openModal;
  }

  /* ===== Contact Modal ===== */
  function setupContactModal() {
    var modal = $('#contactModal');
    if (!modal) return;
    var closeBtn = $('#contactModalClose');
    var cancelBtn = $('#contactModalCancel');
    var okBtn = $('#contactModalOk');
    var textarea = $('#contactMsg');
    var countEl = $('#contactCount');

    function openModal(id) {
      var row = state.data.find(function (r) { return r.id === id; });
      if (!row) return;
      state.currentEditId = id;
      $('#ciName').textContent = row.userName || '—';
      $('#ciUid').textContent = row.userId || '—';
      $('#ciPhone').textContent = row.phone || '—';
      $('#ciEmail').textContent = row.email || '—';
      textarea.value = '';
      countEl.textContent = '0';
      modal.hidden = false;
      setTimeout(function () { textarea.focus(); }, 100);
    }
    function closeModal() { modal.hidden = true; state.currentEditId = null; }

    textarea.addEventListener('input', function () {
      countEl.textContent = textarea.value.length;
    });

    okBtn.addEventListener('click', function () {
      if (!textarea.value.trim()) {
        showToast('请输入消息内容', 'error');
        return;
      }
      closeModal();
      showToast('消息发送成功', 'success');
    });
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    window.__openContact = openModal;
  }

  /* ===== Supplement Modal ===== */
  function setupSupplementModal() {
    var modal = $('#supplementModal');
    if (!modal) return;
    var closeBtn = $('#supplementModalClose');
    var cancelBtn = $('#supplementModalCancel');
    var okBtn = $('#supplementModalOk');

    function openModal(id) {
      var row = state.data.find(function (r) { return r.id === id; });
      if (!row) return;
      state.currentEditId = id;
      $('#suppUser').textContent = (row.userName ? row.userName + ' · ' : '') + row.userId;
      $('#supplementText').value = '';
      modal.hidden = false;
    }
    function closeModal() { modal.hidden = true; state.currentEditId = null; }

    okBtn.addEventListener('click', function () {
      var text = $('#supplementText').value.trim();
      if (!text) {
        showToast('请输入补充说明', 'error');
        return;
      }
      closeModal();
      showToast('补充资料通知已发送', 'success');
    });
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    window.__openSupplement = openModal;
  }

  /* ===== Row Actions ===== */
  function setupRowActions() {
    $('#tableBody').addEventListener('click', function (e) {
      var actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;

      var action = actionEl.dataset.action;
      var id = parseInt(actionEl.dataset.id, 10);

      if (action === 'remark') {
        window.__openRemark && window.__openRemark(id);
      } else if (action === 'contact') {
        window.__openContact && window.__openContact(id);
      } else if (action === 'supplement') {
        window.__openSupplement && window.__openSupplement(id);
      }

      var sortUp = e.target.closest('.sort-up');
      var sortDown = e.target.closest('.sort-down');
      if (sortUp || sortDown) {
        var rowId = parseInt((sortUp || sortDown).dataset.id, 10);
        var row = state.data.find(function (r) { return r.id === rowId; });
        var list = state.filtered;
        var idx = list.findIndex(function (r) { return r.id === rowId; });
        if (row && idx >= 0) {
          if (sortUp && idx > 0) {
            var tmp = list[idx - 1];
            list[idx - 1] = list[idx];
            list[idx] = tmp;
            renderTable();
          } else if (sortDown && idx < list.length - 1) {
            var tmp2 = list[idx + 1];
            list[idx + 1] = list[idx];
            list[idx] = tmp2;
            renderTable();
          }
        }
        e.preventDefault();
      }
    });
  }

  /* ===== Alert Modal ===== */
  function setupAlertModal() {
    var modal = $('#alertModal');
    if (!modal) return;
    var msgEl = $('#alertModalMessage');
    var hideTimer;

    function showAlert(msg) {
      if (msg) msgEl.textContent = msg;
      modal.hidden = false;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        modal.hidden = true;
      }, 2500);
    }

    window.__showAlert = showAlert;
  }

  /* ===== Filter Panel Toggle ===== */
  function setupFilterToggle() {
    var panel = $('#filterPanel');
    var toggleBtn = $('#toggleFilter');
    var text = toggleBtn.querySelector('span');

    toggleBtn.addEventListener('click', function () {
      panel.classList.toggle('collapsed');
      text.textContent = panel.classList.contains('collapsed') ? '展开' : '收起';
    });
  }

  /* ===== Event Bindings ===== */
  function bindEvents() {
    $('#btnSearch').addEventListener('click', applyFilters);
    $('#btnReset').addEventListener('click', resetFilters);

    $('#btnExport').addEventListener('click', function () {
      if (!state.filtered.length) {
        showToast('暂无可导出的数据', 'error');
        return;
      }
      showToast('导出成功，共 ' + state.filtered.length + ' 条数据', 'success');
    });

    var btnBatchDelete = $('#btnBatchDelete');
    if (btnBatchDelete) {
      btnBatchDelete.addEventListener('click', function () {
        if (state.selected.size === 0) {
          showToast('请先勾选要删除的记录', 'error');
          return;
        }
        if (confirm('确定删除选中的 ' + state.selected.size + ' 条记录？')) {
          state.data = state.data.filter(function (r) { return !state.selected.has(r.id); });
          state.selected.clear();
          applyFilters();
          showToast('删除成功', 'success');
        }
      });
    }

    $('#checkAll').addEventListener('change', function (e) {
      var checked = e.target.checked;
      var start = (state.page - 1) * state.pageSize;
      var pageData = state.filtered.slice(start, start + state.pageSize);
      pageData.forEach(function (row) {
        if (checked) state.selected.add(row.id);
        else state.selected.delete(row.id);
      });
      renderTable();
    });

    $('#tableBody').addEventListener('change', function (e) {
      if (!e.target.classList.contains('row-check')) return;
      var id = parseInt(e.target.dataset.id, 10);
      if (e.target.checked) state.selected.add(id);
      else state.selected.delete(id);
      updateCheckAllState();
      updateSelectedCount();
    });

    var paginationBtns = $('#paginationBtns');
    if (paginationBtns) {
      paginationBtns.addEventListener('click', function (e) {
        var btn = e.target.closest('.pg-btn');
        if (!btn) return;
        var page = btn.dataset.page;
        var totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
        if (page === 'prev') goToPage(state.page - 1);
        else if (page === 'next') goToPage(state.page + 1);
        else goToPage(parseInt(page, 10));
      });

      paginationBtns.addEventListener('keydown', function (e) {
        if (e.target.id === 'jumpInput' && e.key === 'Enter') {
          var val = parseInt(e.target.value, 10);
          if (!isNaN(val)) goToPage(val);
        }
      });
    }

    var pgSize = $('#pgSize');
    if (pgSize) {
      pgSize.addEventListener('change', function (e) {
        state.pageSize = parseInt(e.target.value, 10);
        state.page = 1;
        renderTable();
      });
    }

    $$('.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        toggleSort(th.dataset.sort, th);
      });
    });

    $('#toggleSidebar').addEventListener('click', function () {
      toggleSidebar();
    });

    $('#sidebarOverlay').addEventListener('click', function () {
      toggleSidebar(false);
    });

    var debounceTimer;
    $$('.filter-panel input, .filter-panel select').forEach(function (el) {
      if (el.type === 'text' || el.tagName === 'SELECT') {
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') applyFilters();
        });
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) {
        $('#sidebarOverlay').classList.remove('show');
      }
    });
  }

  /* ===== Init ===== */
  function init() {
    setupMenuToggle();
    setupAlertModal();
    setupAwardModal();
    setupRemarkModal();
    setupContactModal();
    setupSupplementModal();
    setupRowActions();
    setupFilterToggle();
    bindEvents();
    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
