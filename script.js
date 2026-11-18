/* =====================================================
   STUDIO BELLEZZA – script.js
   Tudo o que é dinâmico no site está aqui:
   1) DADOS: serviços, profissionais e depoimentos (edite à vontade)
   2) Montagem das seções na página
   3) Janela de agendamento em etapas
   ===================================================== */

/* Atalho: $('#id') = document.querySelector('#id') */
const $ = (s) => document.querySelector(s);
/* ---------- 1) DADOS ---------- */
/* Ícone de traço usado na faixa de serviços */
const P = (d) => `<svg class="ic" viewBox="0 0 48 48">${d}</svg>`;
/* Cada serviço: [nome, duração em minutos, preço em R$, ícone] */
const SERVICOS = [
  [
    "Designer de Sobrancelhas",
    40,
    60,
    P('<path d="M6 28c8-10 24-12 36-4-12-2-24 0-36 4z"/><path d="M12 33c8-4 18-5 28-2"/>'),
  ],
  [
    "Extensão de Cílios",
    90,
    150,
    P(
      '<path d="M6 24c10 8 26 8 36 0"/><path d="M10 28l-4 6M17 31l-2 7M24 32v8M31 31l2 7M38 28l4 6"/>',
    ),
  ],
  [
    "Unhas em Gel",
    60,
    70,
    P(
      '<rect x="16" y="22" width="16" height="20" rx="4"/><rect x="20" y="8" width="8" height="14" rx="2"/>',
    ),
  ],
  [
    "Manicure Pé e Mão",
    60,
    55,
    P('<path d="M16 42V24l-2-8 3-1 3 8V10h3v14V8h3v16V12h3v14l4-6 3 2-6 14z"/>'),
  ],
  [
    "Limpeza de Pele",
    60,
    120,
    P('<circle cx="24" cy="24" r="14"/><path d="M17 22h2M29 22h2M20 30c2 2 6 2 8 0"/>'),
  ],
  [
    "Spá dos Pés",
    50,
    90,
    P(
      '<path d="M24 8c4 5 5 11 0 18-5-7-4-13 0-18zM24 26c-5-2-10-8-11-14 6 1 10 5 11 14zM24 26c5-2 10-8 11-14-6 1-10 5-11 14z"/><path d="M8 34c10 6 22 6 32 0"/>',
    ),
  ],
];
/* Profissionais: [nome, especialidade] */
const PROFISSIONAIS = [
  ["Anna Marques", "Designer de Sobrancelhas, Extensão de Cílios, Maquiagem profissional, designer de sobrancelhas"],
  ["Markira Albuquerque", "Unhas em Gel, manicure e pedicure, Spa dos pés, designer de sobrancelhas"],
];
/* Depoimentos: [nome da cliente, texto] */
const DEPOIMENTOS = [
  ["Mariana Santos", "Atendimento impecável, resultado incrível!"],
  ["Beatriz Lima", "Me sinto ainda mais confiante depois daqui!"],
  ["Carla Mendes", "Profissionais incríveis e um ambiente maravilhoso!"],
  ["Renata Alves", "Pontualidade e capricho em cada detalhe."],
];
/* ---------- 2) MONTAGEM DAS SEÇÕES ---------- */
/* Gera o HTML a partir dos dados acima */
$("#strip").innerHTML = SERVICOS.map(
  (s, i) => `<button data-open="${i}">${s[3]}<span>${s[0]}</span></button>`,
).join("");
$("#team").innerHTML = PROFISSIONAIS.map(
  (p) =>
    `<article class="tc"><span class="ini">${p[0][0]}</span><hr><b>${p[0]}</b><span>${p[1]}</span></article>`,
).join("");
$("#trk").innerHTML = DEPOIMENTOS.map(
  (r) =>
    `<figure class="rv" style="margin:0"><div class="a">${r[0][0]}</div><div><p>“${r[1]}”</p><small>${r[0]}</small><span class="st" aria-label="5 estrelas">★★★★★</span></div></figure>`,
).join("");
$("#pv").onclick = () => $("#trk").scrollBy({ left: -360, behavior: "smooth" });
$("#nx").onclick = () => $("#trk").scrollBy({ left: 360, behavior: "smooth" });

/* agendamento */
/* ---------- 3) AGENDAMENTO ---------- */
/* Horários oferecidos por dia */
const HORARIOS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];
const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const ETAPAS = ["Tratamento", "Profissional", "Data e hora", "Seus dados", "Revisão", "Confirmado"];
const formatarMoeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatarData = (d) =>
  d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
/* Simula horários já reservados (troque por dados reais de uma API depois) */
const estaOcupado = (d, p, h) =>
  (d.getDate() * 7 + d.getMonth() * 13 + p * 5 + HORARIOS.indexOf(h) * 11) % 4 === 0;
/* Lista os próximos 14 dias */
const proximosDias = () => {
  const a = [],
    t = new Date();
  t.setHours(0, 0, 0, 0);
  for (let i = 1; a.length < 14; i++) {
    const d = new Date(t);
    d.setDate(t.getDate() + i);
    a.push(d);
  }
  return a;
};
/* 'estado' guarda tudo o que a cliente escolheu até agora:
   etapa (0 a 5), svc (serviço), pro (profissional), day (dia), time (hora), nome, tel */
let estado;
const novoEstado = () =>
  (estado = { etapa: 0, svc: null, pro: null, day: null, time: null, nome: "", tel: "" });
novoEstado();
let opener = null;
/* Abre a janela de agendamento (opcionalmente já com um serviço escolhido) */
function abrirModal(i) {
  opener = document.activeElement;
  novoEstado();
  if (i != null && i !== "") estado.svc = +i;
  estado.etapa = 0;
  $("#md").classList.add("on");
  document.body.style.overflow = "hidden";
  renderizar();
  $("#cl").focus();
}
function fecharModal() {
  $("#md").classList.remove("on");
  document.body.style.overflow = "";
  opener && opener.focus();
}
/* Só libera o botão "Continuar" quando a etapa atual foi preenchida */
function podeAvancar() {
  return [estado.svc !== null, estado.pro !== null, !!(estado.day && estado.time), true, true][
    estado.etapa
  ];
}
/* Desenha o conteúdo da etapa atual dentro da janela */
function renderizar() {
  const b = $("#bk");
  let h = "";
  $("#ms").textContent =
    estado.etapa < 5 ? `Etapa ${estado.etapa + 1} de 5 · ${ETAPAS[estado.etapa]}` : "";
  $("#bar").innerHTML = ETAPAS.slice(0, 5)
    .map((_, i) => `<i class="${i <= estado.etapa ? "on" : ""}"></i>`)
    .join("");
  if (estado.etapa == 0)
    h = `<div class="gr">${SERVICOS.map((s, i) => `<button class="opt" aria-pressed="${estado.svc === i}" data-k="svc" data-i="${i}"><b>${s[0]}</b><span>${s[1]} min<br>${formatarMoeda(s[2])}</span></button>`).join("")}</div>`;
  if (estado.etapa == 1)
    h = `<div class="gr">${PROFISSIONAIS.map((p, i) => `<button class="opt" aria-pressed="${estado.pro === i}" data-k="pro" data-i="${i}"><b>${p[0]}</b><span>${p[1]}</span></button>`).join("")}</div>`;
  if (estado.etapa == 2) {
    h = `<div class="lb">Escolha o dia</div><div class="days">${proximosDias()
      .map(
        (d, i) =>
          `<button class="d" ${d.getDay() ? "" : "disabled"} aria-pressed="${estado.day && +estado.day === +d}" data-k="day" data-i="${i}" aria-label="${formatarData(d)}"><small>${DIAS_SEMANA[d.getDay()]}</small><b>${d.getDate()}</b><small>${MESES[d.getMonth()]}</small></button>`,
      )
      .join("")}</div><div class="lb" id="hl" style="margin-top:14px">Horários disponíveis</div>`;
    h += estado.day
      ? `<div class="sl">${HORARIOS.map((t) => `<button ${estaOcupado(estado.day, estado.pro, t) ? "disabled" : ""} aria-pressed="${estado.time === t}" data-k="time" data-i="${t}">${t}</button>`).join("")}</div>`
      : '<div class="hint">Selecione um dia para ver os horários.</div>';
  }
  if (estado.etapa == 3)
    h = `<div class="f"><label for="nm">Nome completo</label><input id="nm" autocomplete="name" value="${estado.nome}"><span class="e" id="en"></span></div><div class="f"><label for="tl">WhatsApp</label><input id="tl" inputmode="tel" autocomplete="tel" placeholder="(84) 99999-9999" value="${estado.tel}"><span class="e" id="et"></span></div>`;
  if (estado.etapa == 4) {
    const s = SERVICOS[estado.svc];
    h = `<div class="sm"><div><span>Tratamento</span><span>${s[0]}</span></div><div><span>Profissional</span><span>${PROFISSIONAIS[estado.pro][0]}</span></div><div><span>Data</span><span>${formatarData(estado.day)}</span></div><div><span>Horário</span><span>${estado.time} · ${s[1]} min</span></div><div><span>Valor</span><b>${formatarMoeda(s[2])}</b></div></div>`;
  }
  if (estado.etapa == 5)
    h = `<div class="ok"><div class="ck"><svg class="ic" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h2>Horário reservado</h2><p>${estado.nome.split(" ")[0]}, seu horário de ${SERVICOS[estado.svc][0].toLowerCase()} está marcado para ${formatarData(estado.day)}, às ${estado.time}. Enviaremos a confirmação por WhatsApp.</p></div>`;
  b.innerHTML = h;
  $("#mf").style.display = estado.etapa == 5 ? "none" : "flex";
  $("#bb").style.visibility = estado.etapa ? "visible" : "hidden";
  $("#bn").textContent = estado.etapa == 4 ? "Confirmar" : "Continuar";
  $("#bn").disabled = !podeAvancar();
}
/* Cliques nas opções (serviço, profissional, dia, hora) */
$("#bk").addEventListener("click", (e) => {
  const t = e.target.closest("[data-k]");
  if (!t) return;
  const k = t.dataset.k,
    v = t.dataset.i;
  if (k == "svc") estado.svc = +v;
  if (k == "pro") {
    if (estado.pro !== +v) {
      estado.day = null;
      estado.time = null;
    }
    estado.pro = +v;
  }
  if (k == "day") {
    estado.day = proximosDias()[+v];
    estado.time = null;
  }
  if (k == "time") estado.time = v;
  renderizar();
  if (k == "day") $("#hl").scrollIntoView({ behavior: "smooth", block: "nearest" });
});
/* Digitação nos campos de nome e WhatsApp (com máscara de telefone) */
$("#bk").addEventListener("input", (e) => {
  if (e.target.id == "nm") estado.nome = e.target.value;
  if (e.target.id == "tl") {
    let v = e.target.value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    e.target.value = v;
    estado.tel = v;
  }
});
/* Botões Voltar / Continuar */
$("#bb").onclick = () => {
  estado.etapa--;
  renderizar();
};
$("#bn").onclick = () => {
  if (estado.etapa == 3) {
    const a = estado.nome.trim().split(/\s+/).length < 2,
      c = estado.tel.replace(/\D/g, "").length < 10;
    $("#en").textContent = a ? "Informe nome e sobrenome." : "";
    $("#et").textContent = c ? "Informe um WhatsApp com DDD." : "";
    $("#nm").setAttribute("aria-invalid", a);
    $("#tl").setAttribute("aria-invalid", c);
    if (a || c) return;
  }
  estado.etapa++;
  renderizar();
};
/* Qualquer elemento com data-open abre o agendamento */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-open]");
  if (t) abrirModal(t.dataset.open);
});
$("#cl").onclick = fecharModal;
$("#md").addEventListener("click", (e) => {
  if (e.target.id == "md") fecharModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key == "Escape" && $("#md").classList.contains("on")) fecharModal();
});
